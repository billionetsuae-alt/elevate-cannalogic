import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Professional Invoice Styles - Clean & Aligned
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2px solid #2E7D32',
    },
    logo: {
        width: 80,
    },
    invoiceTitle: {
        textAlign: 'right',
    },
    invoiceLabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    invoiceNumber: {
        fontSize: 11,
        color: '#333',
        marginTop: 5,
    },
    invoiceDate: {
        fontSize: 10,
        color: '#666',
        marginTop: 3,
    },
    // Addresses Row
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        marginBottom: 30,
    },
    addressBox: {
        width: '48%',
    },
    addressLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#2E7D32',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    addressName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    addressLine: {
        fontSize: 10,
        color: '#444',
        marginBottom: 3,
        lineHeight: 1.4,
    },
    // Table
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#2E7D32',
        padding: 10,
    },
    tableHeaderCell: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottom: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    col1: { width: '45%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },
    productName: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    productDesc: {
        fontSize: 9,
        color: '#666',
    },
    // Totals
    totalsContainer: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalsBox: {
        width: 220,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    totalLabel: {
        fontSize: 10,
        color: '#666',
    },
    totalValue: {
        fontSize: 10,
        color: '#333',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 8,
        borderTop: '2px solid #2E7D32',
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    // Status Badge
    paidBadge: {
        backgroundColor: '#2E7D32',
        color: 'white',
        padding: '4 12',
        borderRadius: 3,
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 8,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: '1px solid #ddd',
        paddingTop: 15,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: '#888',
    },
    footerCompany: {
        fontSize: 9,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    // Notes
    notesBox: {
        marginTop: 35,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderLeft: '3px solid #2E7D32',
    },
    notesTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    notesText: {
        fontSize: 8,
        color: '#666',
        lineHeight: 1.5,
    },
    // Thank you
    thankYou: {
        marginTop: 25,
        textAlign: 'center',
    },
    thankYouText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
});

const InvoiceTemplate = ({ order }) => {
    // Map Airtable field names to expected format
    const customerName = order.customer || order.Name || 'Customer';
    const customerEmail = order.email || order.Email || '';
    const customerPhone = order.phone || order.Phone || '';
    const customerAddress = order.address || order.Address || '';
    const customerCity = order.city || order.City || '';
    const customerState = order.state || order.State || '';
    const customerPincode = order.pincode || order.Pincode || '';
    const paymentId = order.paymentId || order.Payment_ID || order.id || '';
    const amount = order.amount || order.Amount_Paid || 0;
    const orderDate = order.date || new Date().toISOString().split('T')[0];
    const items = order.items || order.Pack || '1 Pack';

    const invoiceNumber = `INV-${paymentId}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image
                        src="/Cannalogic-Colored-Vertical.png"
                        style={styles.logo}
                    />
                    <View style={styles.invoiceTitle}>
                        <Text style={styles.invoiceLabel}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
                        <Text style={styles.invoiceDate}>Date: {orderDate}</Text>
                        <Text style={styles.paidBadge}>PAID</Text>
                    </View>
                </View>

                {/* Billing Addresses */}
                <View style={styles.addressRow}>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressLabel}>Bill To</Text>
                        <Text style={styles.addressName}>{customerName}</Text>
                        {customerPhone && <Text style={styles.addressLine}>Phone: {customerPhone}</Text>}
                        {customerEmail && <Text style={styles.addressLine}>Email: {customerEmail}</Text>}
                        {customerAddress && <Text style={styles.addressLine}>{customerAddress}</Text>}
                        {(customerCity || customerState) && (
                            <Text style={styles.addressLine}>
                                {customerCity}{customerCity && customerState ? ', ' : ''}{customerState} - {customerPincode}
                            </Text>
                        )}
                    </View>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressLabel}>From</Text>
                        <Text style={styles.addressName}>Cannalogic Wellness Pvt. Ltd.</Text>
                        <Text style={styles.addressLine}>GSTIN: 29AABCC1234H1Z5</Text>
                        <Text style={styles.addressLine}>Phone: +91 98765 43210</Text>
                        <Text style={styles.addressLine}>Email: support@cannalogic.in</Text>
                        <Text style={styles.addressLine}>Bangalore, Karnataka</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.col1]}>Description</Text>
                        <Text style={[styles.tableHeaderCell, styles.col2]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.col3]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, styles.col4]}>Amount</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.col1}>
                            <Text style={styles.productName}>Elevate Cannabis Full Spectrum Softgels</Text>
                            <Text style={styles.productDesc}>{items} | Premium CBD Formula</Text>
                        </View>
                        <Text style={[styles.col2, { fontSize: 10 }]}>1</Text>
                        <Text style={[styles.col3, { fontSize: 10 }]}>₹{Number(amount).toLocaleString('en-IN')}</Text>
                        <Text style={[styles.col4, { fontSize: 10, fontWeight: 'bold' }]}>₹{Number(amount).toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>₹{Number(amount).toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>GST (Included)</Text>
                            <Text style={styles.totalValue}>₹0.00</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Shipping</Text>
                            <Text style={styles.totalValue}>FREE</Text>
                        </View>
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total Paid</Text>
                            <Text style={styles.grandTotalValue}>₹{Number(amount).toLocaleString('en-IN')}</Text>
                        </View>
                    </View>
                </View>

                {/* Thank You */}
                <View style={styles.thankYou}>
                    <Text style={styles.thankYouText}>Thank you for your purchase!</Text>
                </View>

                {/* Notes */}
                <View style={styles.notesBox}>
                    <Text style={styles.notesTitle}>Important Information</Text>
                    <Text style={styles.notesText}>
                        • This invoice serves as proof of purchase for your Elevate product.{'\n'}
                        • For queries or support, contact support@cannalogic.in{'\n'}
                        • Products are for adults 18+ only. Use responsibly.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Computer-generated invoice. No signature required.</Text>
                        <Text style={styles.footerText}>Payment ID: {paymentId}</Text>
                    </View>
                    <Text style={[styles.footerCompany, { marginTop: 8, textAlign: 'center' }]}>
                        CANNALOGIC WELLNESS PVT. LTD. | www.elevatecannalogic.com
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoiceTemplate;
