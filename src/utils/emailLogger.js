import { supabase } from './supabase';

/**
 * Logs an email event to the database.
 * @param {string} recipient - Email recipient
 * @param {string} templateSlug - Slug of the email template
 * @param {string} status - Status of the email (sent/failed/pending)
 * @param {object} metadata - Additional metadata (e.g., error details, order_id)
 */
export const logEmail = async (recipient, templateSlug, status = 'sent', metadata = {}) => {
    try {
        const { error } = await supabase
            .from('email_logs')
            .insert([{
                recipient,
                template_slug: templateSlug,
                status,
                metadata,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('Failed to log email:', error);
        }
    } catch (err) {
        console.error('Error in logEmail utility:', err);
    }
};
