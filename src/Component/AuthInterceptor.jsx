import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "../lib/navigation";

export default function AuthInterceptor() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
    return () => setNavigate(null);
  }, [navigate]);
  return null;
}
