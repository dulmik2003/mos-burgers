import jsPDF from 'jspdf';
import { Order } from '../types';

export function generateReceipt(order: Order) {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('MOS BURGERS', 20, 20);
  pdf.setFontSize(12);
  pdf.text('Receipt', 20, 30);
  
  // Order details
  pdf.text(`Order ID: #${order.id.slice(-6)}`, 20, 45);
  pdf.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 55);
  pdf.text(`Customer: ${order.customer.name}`, 20, 65);
  pdf.text(`Contact: ${order.customer.contactNumber}`, 20, 75);
  
  // Items table header
  let yPos = 90;
  pdf.text('Item', 20, yPos);
  pdf.text('Qty', 100, yPos);
  pdf.text('Price', 130, yPos);
  pdf.text('Total', 160, yPos);
  
  // Draw line under header
  pdf.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;
  
  // Items
  order.items.forEach((item) => {
    pdf.text(item.foodItem.name, 20, yPos);
    pdf.text(item.quantity.toString(), 100, yPos);
    pdf.text(`Rs. ${item.foodItem.price}`, 130, yPos);
    pdf.text(`Rs. ${item.subtotal.toLocaleString()}`, 160, yPos);
    yPos += 10;
  });
  
  // Draw line before totals
  pdf.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Totals
  pdf.text(`Subtotal: Rs. ${order.subtotal.toLocaleString()}`, 130, yPos);
  yPos += 10;
  
  if (order.discountPercentage > 0) {
    pdf.text(`Discount (${order.discountPercentage}%): -Rs. ${order.discountAmount.toLocaleString()}`, 130, yPos);
    yPos += 10;
  }
  
  pdf.setFontSize(14);
  pdf.text(`TOTAL: Rs. ${order.total.toLocaleString()}`, 130, yPos);
  
  // Footer
  yPos += 30;
  pdf.setFontSize(10);
  pdf.text('Thank you for your business!', 20, yPos);
  pdf.text('Visit us again!', 20, yPos + 10);
  
  // Save the PDF
  pdf.save(`receipt-${order.id.slice(-6)}.pdf`);
}