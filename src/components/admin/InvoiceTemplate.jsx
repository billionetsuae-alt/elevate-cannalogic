import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Professional Invoice Styles
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
    },
    // Header Section
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    logoSection: {
        flexDirection: 'column',
    },
    brandName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        letterSpacing: 1,
    },
    brandTagline: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    invoiceLabel: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    invoiceMeta: {
        textAlign: 'right',
        marginTop: 8,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 3,
    },
    metaLabel: {
        fontSize: 9,
        color: '#888',
        marginRight: 10,
        width: 80,
        textAlign: 'right',
    },
    metaValue: {
        fontSize: 10,
        color: '#333',
        width: 100,
    },
    // Divider
    divider: {
        borderBottom: '2px solid #2E7D32',
        marginVertical: 20,
    },
    thinDivider: {
        borderBottom: '1px solid #e0e0e0',
        marginVertical: 15,
    },
    // Billing Section
    billingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    billingBox: {
        width: '48%',
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#2E7D32',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    customerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    customerDetail: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
        lineHeight: 1.4,
    },
    // Table
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#2E7D32',
        padding: 12,
        color: 'white',
    },
    tableHeaderText: {
        fontWeight: 'bold',
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #eee',
        padding: 12,
        backgroundColor: '#fafafa',
    },
    tableRowAlt: {
        flexDirection: 'row',
        borderBottom: '1px solid #eee',
        padding: 12,
        backgroundColor: '#fff',
    },
    col1: { width: '45%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },
    // Totals
    totalsSection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
        width: 250,
    },
    totalLabel: {
        fontSize: 10,
        color: '#666',
        width: 120,
    },
    totalValue: {
        fontSize: 10,
        color: '#333',
        width: 130,
        textAlign: 'right',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 12,
        borderTop: '2px solid #2E7D32',
        width: 250,
    },
    grandTotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        width: 120,
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        width: 130,
        textAlign: 'right',
    },
    // Notes
    notesSection: {
        marginTop: 40,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
    },
    notesTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    notesText: {
        fontSize: 9,
        color: '#666',
        lineHeight: 1.5,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 8,
        color: '#888',
        marginBottom: 3,
    },
    footerBrand: {
        fontSize: 10,
        color: '#2E7D32',
        fontWeight: 'bold',
        marginTop: 5,
    },
    // Thank you
    thankYou: {
        marginTop: 30,
        textAlign: 'center',
    },
    thankYouText: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    thankYouSub: {
        fontSize: 10,
        color: '#888',
        marginTop: 5,
    },
});

const InvoiceTemplate = ({ order }) => {
    const invoiceNumber = order.paymentId || order.id || `INV-${Date.now()}`;
    const invoiceDate = order.date || new Date().toISOString().split('T')[0];
    const subtotal = order.amount || 0;
    const gst = 0; // Add GST calculation if needed
    const total = subtotal + gst;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Image
                            src="/Cannalogic-Colored-Vertical.png"
                            style={{ width: 100, height: 'auto' }}
                        />
                    </View>
                    <View>
                        <Text style={styles.invoiceLabel}>INVOICE</Text>
                        <View style={styles.invoiceMeta}>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Invoice No:</Text>
                                <Text style={styles.metaValue}>{invoiceNumber}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Date:</Text>
                                <Text style={styles.metaValue}>{invoiceDate}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Status:</Text>
                                <Text style={[styles.metaValue, { color: '#2E7D32', fontWeight: 'bold' }]}>PAID</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Billing Section */}
                <View style={styles.billingSection}>
                    <View style={styles.billingBox}>
                        <Text style={styles.sectionTitle}>Bill To</Text>
                        <Text style={styles.customerName}>{order.customer || 'Customer'}</Text>
                        <Text style={styles.customerDetail}>{order.phone || ''}</Text>
                        <Text style={styles.customerDetail}>{order.email || ''}</Text>
                        <Text style={styles.customerDetail}>{order.address || ''}</Text>
                        <Text style={styles.customerDetail}>
                            {order.city ? `${order.city}, ${order.state} - ${order.pincode}` : ''}
                        </Text>
                    </View>
                    <View style={styles.billingBox}>
                        <Text style={styles.sectionTitle}>From</Text>
                        <Text style={styles.customerName}>Cannalogic Wellness Pvt. Ltd.</Text>
                        <Text style={styles.customerDetail}>GSTIN: 29AABCC1234H1Z5</Text>
                        <Text style={styles.customerDetail}>support@cannalogic.in</Text>
                        <Text style={styles.customerDetail}>www.elevatecannalogic.com</Text>
                        <Text style={styles.customerDetail}>Bangalore, Karnataka</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
                        <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
                        <Text style={[styles.tableHeaderText, styles.col3]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.col1}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                                Elevate Cannabis Full Spectrum Softgels
                            </Text>
                            <Text style={{ fontSize: 9, color: '#666' }}>
                                {order.items || '30 Capsules Pack'} | Premium CBD Formula
                            </Text>
                        </View>
                        <Text style={[styles.col2, { fontSize: 10 }]}>1</Text>
                        <Text style={[styles.col3, { fontSize: 10 }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
                        <Text style={[styles.col4, { fontSize: 10, fontWeight: 'bold' }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
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
                        <Text style={styles.grandTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Thank You */}
                <View style={styles.thankYou}>
                    <Text style={styles.thankYouText}>Thank you for your purchase! 🌿</Text>
                    <Text style={styles.thankYouSub}>Your wellness journey starts here.</Text>
                </View>

                {/* Notes */}
                <View style={styles.notesSection}>
                    <Text style={styles.notesTitle}>Important Information</Text>
                    <Text style={styles.notesText}>
                        • This invoice serves as proof of purchase for your Elevate product.{'\n'}
                        • For any queries or support, please contact support@cannalogic.in{'\n'}
                        • Products are for adults 18+ only. Please use responsibly.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>This is a computer-generated invoice. No signature required.</Text>
                    <Text style={styles.footerText}>Payment ID: {order.paymentId || 'N/A'}</Text>
                    <Text style={styles.footerBrand}>CANNALOGIC WELLNESS PVT. LTD.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoiceTemplate;
