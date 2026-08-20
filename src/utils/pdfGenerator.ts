import { jsPDF } from 'jspdf';
import { Quotation, SiteSettings } from '../types';

export function generateQuotationPDF(quote: Quotation, settings: SiteSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header background banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(settings.profileName || 'SK YADAV', 20, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.text('Full Stack Web Developer & Freelance Specialist', 20, 25);
  doc.text(`Email: ${settings.email} | WhatsApp: +${settings.whatsappNumber}`, 20, 32);

  // Document Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(129, 140, 248); // indigo-400
  doc.text('PROJECT QUOTATION', pageWidth - 20, 22, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Quote Ref: ${quote.quotationNumber || quote.id.toUpperCase()}`, pageWidth - 20, 29, { align: 'right' });
  doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`, pageWidth - 20, 35, { align: 'right' });

  yPos = 52;

  // Client Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, yPos, (pageWidth - 40) / 2 - 5, 34, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR:', 25, yPos + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(quote.clientName, 25, yPos + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  if (quote.clientCompany) doc.text(quote.clientCompany, 25, yPos + 20);
  doc.text(quote.clientEmail, 25, yPos + 26);

  // Project Summary Box
  const rightBoxX = 20 + (pageWidth - 40) / 2 + 5;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightBoxX, yPos, (pageWidth - 40) / 2 - 5, 34, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT DETAILS:', rightBoxX + 5, yPos + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text((quote.projectTitle || 'Web Project').substring(0, 35), rightBoxX + 5, yPos + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Estimated Delivery: ${quote.estimatedDeliveryDays || '2-3 Weeks'}`, rightBoxX + 5, yPos + 20);
  doc.text(`Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}`, rightBoxX + 5, yPos + 26);

  yPos += 44;

  // Table Header
  doc.setFillColor(99, 102, 241); // indigo-600
  doc.rect(20, yPos, pageWidth - 40, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ITEM / DELIVERABLE DESCRIPTION', 25, yPos + 6.5);
  doc.text(`AMOUNT (${quote.currency || 'USD'})`, pageWidth - 25, yPos + 6.5, { align: 'right' });

  yPos += 10;

  // Items List
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  quote.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPos, pageWidth - 40, 10, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(20, yPos + 10, pageWidth - 20, yPos + 10);

    doc.setTextColor(30, 41, 59);
    doc.text(`${index + 1}. ${item.description}`, 25, yPos + 6.5);
    doc.text(`$${item.amount.toLocaleString()}`, pageWidth - 25, yPos + 6.5, { align: 'right' });
    yPos += 10;
  });

  yPos += 5;

  // Totals Section
  const totalsX = pageWidth - 90;
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', totalsX, yPos);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${quote.subtotal.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 6;

  if (quote.tax > 0) {
    doc.setTextColor(71, 85, 105);
    doc.text('Tax / Processing:', totalsX, yPos);
    doc.text(`$${quote.tax.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 6;
  }

  if (quote.discount > 0) {
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.text('Discount Applied:', totalsX, yPos);
    doc.text(`-$${quote.discount.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 6;
  }

  // Total Line
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 5, yPos, pageWidth - 20, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(99, 102, 241);
  doc.text('TOTAL:', totalsX, yPos);
  doc.text(`$${quote.total.toLocaleString()} ${quote.currency || 'USD'}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 14;

  // Payment Terms & Notes
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, yPos, pageWidth - 40, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('PAYMENT TERMS & TIMELINE:', 25, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(quote.paymentTerms || '50% Upfront, 50% on completion.', pageWidth - 50), 25, yPos + 12);

  if (quote.notes) {
    doc.text(doc.splitTextToSize(`Notes: ${quote.notes}`, pageWidth - 50), 25, yPos + 19);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for considering SK Yadav for your web development project.', pageWidth / 2, 282, { align: 'center' });
  doc.text('Building modern, responsive and scalable websites & digital platforms.', pageWidth / 2, 287, { align: 'center' });

  // Trigger download
  doc.save(`Quotation_${quote.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${quote.id}.pdf`);
}

export const generateQuotePDF = generateQuotationPDF;
