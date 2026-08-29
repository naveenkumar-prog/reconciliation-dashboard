-- CreateIndex
CREATE INDEX "Order_orderRef_idx" ON "public"."Order"("orderRef");

-- CreateIndex
CREATE INDEX "Payment_orderRef_idx" ON "public"."Payment"("orderRef");
