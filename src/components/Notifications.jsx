import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const Notifications = () => {
  useEffect(() => {
    // Listen for new guests (check-ins)
    const guestChannel = supabase
      .channel('guest-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guests' }, (payload) => {
        toast.success(`New Check-in: ${payload.new.name} in Room ${payload.new.room_num}`, {
          icon: '🔑',
          duration: 5000,
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'guests' }, (payload) => {
        if (payload.old.status === 'in' && payload.new.status === 'out') {
          toast.success(`Guest Checked Out: ${payload.new.name} from Room ${payload.new.room_num}`, {
            icon: '🚪',
            duration: 5000,
          });
        }
      })
      .subscribe();

    // Listen for room status changes (housekeeping)
    const roomChannel = supabase
      .channel('room-notifications')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' }, (payload) => {
        if (payload.old.status !== payload.new.status) {
          const statusIcons = {
            'available': '✅',
            'occupied': '🏨',
            'dirty': '🧹',
            'maintenance': '🛠️'
          };
          toast(`Room ${payload.new.num} is now ${payload.new.status.toUpperCase()}`, {
            icon: statusIcons[payload.new.status] || 'ℹ️',
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(guestChannel);
      supabase.removeChannel(roomChannel);
    };
  }, []);

  return null; // This component only handles logic
};

export default Notifications;
