/*
  # Add notifications table and realtime functionality

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Add function to create notification
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'business_proposal' THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        NEW.investor_id,
        'New Business Proposal',
        'You have received a new business proposal',
        'proposal_received',
        jsonb_build_object('proposal_id', NEW.id)
      );
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status != OLD.status THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        NEW.user_id,
        'Proposal Status Updated',
        'Your proposal status has been updated to ' || NEW.status,
        'proposal_' || NEW.status,
        jsonb_build_object('proposal_id', NEW.id)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;