import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  return { signUp };
};