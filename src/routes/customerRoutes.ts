import { Router } from "express";
import { CustomerController } from "../controllers/customerController";

const router = Router();

router.post("/", CustomerController.createCustomer);
router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

router.get("/search/all", CustomerController.searchCustomers);
router.get("/:id/orders", CustomerController.getCustomerOrders);
router.get("/analytics/top-customers", CustomerController.getTopCustomers);
router.get(
  "/analytics/inactive-customers",
  CustomerController.getInactiveCustomers
);

export default router;
