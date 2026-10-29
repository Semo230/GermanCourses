// Supabase Auth error codes → Arabic messages that say what to do next.
export function authErrorMessage(error: { code?: string; status?: number; message?: string } | null | undefined) {
  switch (error?.code) {
    case "invalid_credentials":
      return "الإيميل أو الباسورد مش مظبوط. اتأكدوا منهم وجرّبوا تاني.";
    case "email_not_confirmed":
      return "لسه ما أكّدتوش الإيميل. افتحوا رسالة التأكيد اللي وصلتكم ودوسوا على الرابط.";
    case "user_already_exists":
    case "email_exists":
      return "الإيميل ده عليه حساب بالفعل. سجّلوا دخول، أو استخدموا «نسيت الباسورد».";
    case "weak_password":
      return "الباسورد ضعيف. استخدموا 8 حروف أو أرقام على الأقل.";
    case "same_password":
      return "الباسورد الجديد لازم يبقى مختلف عن القديم.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "استنوا دقيقة وجرّبوا تاني.";
    case "email_address_invalid":
      return "الإيميل ده مش صحيح.";
    case "otp_expired":
      return "الرابط ده انتهت صلاحيته. اطلبوا رابط جديد.";
  }
  if (error?.status === 429) return "استنوا دقيقة وجرّبوا تاني.";
  return "حصلت مشكلة، جرّبوا تاني بعد شوية.";
}
