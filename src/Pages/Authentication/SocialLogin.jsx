import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/useAuth";

/* eslint-disable react/prop-types */
const SocialLogin = ({ onSuccess }) => {
  const { googleSingIn } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { user } = await googleSingIn();
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err) {
      console.log(err?.message);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleLogin}
      type="button"
      className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft"
    >
      <FcGoogle className="h-5 w-5" />
      Sign in with Google
    </motion.button>
  );
};

export default SocialLogin;
