import { I18nVariables } from "@supabase/auth-ui-shared";

export const i18n_ptbr = {
    "sign_in": {
        email_label: "E-mail",
        password_label: "Senha",
        email_input_placeholder: "Digite seu e-mail",
        password_input_placeholder: "Digite sua senha",
        button_label: "Entrar",
        loading_button_label: "Entrando...",
        social_provider_text: "Ou continue com",
        link_text: "Criar uma conta"
    },
    "forgotten_password": {
        email_label: "E-mail",
        password_label: "Senha",
        email_input_placeholder: "Digite seu e-mail",
        button_label: "Recuperar senha",
        loading_button_label: "Enviando...",
        link_text: "Esqueceu sua senha?",
        confirmation_text: "Se um e-mail válido estiver cadastrado, você receberá instruções para redefinir sua senha."
    },
    error_messages: {
        "To signup, please provide your email": "Para cadastrar, por favor, forneça seu e-mail",
        "Signup requires a valid password": "O cadastro requer uma senha válida",
        "User already registered": "Usuário já cadastrado",
        "Only an email address or phone number should be provided on signup.": "No cadastro, forneça apenas um e-mail ou número de telefone",
        "Signups not allowed for this instance": "Cadastros não permitidos para esta instância",
        "Email signups are disabled": "Cadastros por e-mail estão desativados",
        "Email link is invalid or has expired": "O link de e-mail é inválido ou expirou",
        "Token has expired or is invalid": "O token expirou ou é inválido",
        "The new email address provided is invalid": "O novo endereço de e-mail fornecido é inválido",
        "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres",
        "Invalid login credentials": "Senha ou e-mail inválidos",
        generic: "Ocorreu um erro. Por favor, tente novamente."
    }
} satisfies I18nVariables & { error_messages: Record<string, string> };