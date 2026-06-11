import express from "express"
import { checkBalance, depositMoney, sendMoney, transactionHistory, getNotifications, markAsRead, changePassword, changePin } from "../Controllers/Transaction.js"
import  auth from "../Middleware/auth.js";

const router = express.Router()

router.post("/deposit-money",auth,depositMoney)
router.post("/send-money",auth,sendMoney)
router.get("/check-balance",auth,checkBalance)
router.get("/transaction-history",auth,transactionHistory)

router.get("/notifications", auth, getNotifications);
router.put("/notifications/read", auth, markAsRead);

router.put("/change-password", auth, changePassword)
router.put("/change-pin", auth, changePin)


export default router;