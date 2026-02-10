CREATE POLICY "Admins can delete contact messages" ON contact_messages
    FOR DELETE
    USING (auth.role() = 'authenticated');

GRANT DELETE ON contact_messages TO authenticated;
