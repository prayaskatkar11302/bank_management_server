import Transaction from "../Modals/transaction.js";
import User from "../Modals/user.js";
import Notification from "../Modals/notification.js";
import bcrypt from "bcrypt"

export const depositMoney = async (req, res) => {
    try {
        let { amount } = req.body
        amount = Number(amount)

        const user = await User.findById(req.user.id)

        user.balance = (user.balance || 0) + amount

        await user.save()

        await Transaction.create({ type: "deposit", amount, to: user._id })

        await Notification.create({
            user: user._id,
            message: `₹${amount} deposited successfully`
        });

        res.status(201).json({ message: "Money Deposited", balance: user.balance })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendMoney = async (req, res) => {
    try {
        const { email, amount, transactionPin } = req.body;

        const sender = await User.findById(req.user.id);
        const receiver = await User.findOne({ email });

        if (!sender) {
            return res.status(400).json({ message: "Sender not found" });
        }

        if (!receiver) {
            return res.status(400).json({ message: "Receiver is not found" });
        }

        const amountNumber = Number(amount);

        if (!amountNumber || amountNumber <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (sender.balance < amountNumber) {
            return res.status(400).json({ message: "Insufficient Balance" });
        }

        // ✅ FIXED PIN CHECK
        if (String(sender.transactionPin) !== String(transactionPin)) {
            return res.status(400).json({ message: "Transaction PIN is Invalid" });
        }

        sender.balance -= amountNumber;
        receiver.balance += amountNumber;

        await sender.save();
        await receiver.save();

        await Transaction.create({
            type: "send",
            amount: amountNumber,
            from: sender._id,
            to: receiver._id
        });

        await Notification.create([
            {
                user: sender._id,
                message: `You sent ₹${amount} to ${receiver.email}`
            },
            {
                user: receiver._id,
                message: `You received ₹${amount} from ${sender.email}`
            }
        ]);

        res.status(201).json({
            message: "Send Money Successfully",
            balance: sender.balance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const checkBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        res.status(200).json({ balance: user.balance })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const transactionHistory = async (req, res) => {
    try {

        const userId = req.user.id;

        const transactions = await Transaction.find({
            $or: [
                { from: userId },
                { to: userId }
            ]
        })
            .populate("from", "email")
            .populate("to", "email")
            .sort({ createdAt: -1 });
        console.log("Logged User ID:", req.user.id)
        console.log("Transactions", transactions)

        res.status(200).json({
            count: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const getNotifications = async (req, res) => {
  try {

    // ✅ Check user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .lean(); // faster response

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message
    });
  }
};
export const markAsRead = async (req, res) => {
  try {

    await Notification.updateMany(
      { user: req.user.id },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const changePin = async (req, res) => {
  try {
    const { transactionPin } = req.body;

    if (!transactionPin) {
      return res.status(400).json({
        message: "PIN is required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.transactionPin = transactionPin;

    await user.save();

    res.status(200).json({
      message: "PIN updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
