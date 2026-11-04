
import { supabase } from "../lib/supabase";

export async function logActivity({
  activity_type,
  title,
  description,
  status = "completed",
  metadata = {},
}) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      console.warn("Activity not saved: user not logged in");
      return;
    }

    const { error } = await supabase
      .from("user_activity")
      .insert({
        user_id: user.id,
        activity_type,
        title,
        description,
        status,
        metadata,
      });

    if (error) throw error;

  } catch (error) {
    console.error("Failed to save activity:", error.message);
  }
}
