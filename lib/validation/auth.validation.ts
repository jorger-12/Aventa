import type { SignInInput, SignUpInput } from "@/lib/auth";

export class ValidationError extends Error {
  readonly field?: string;
  readonly code: string;

  constructor(message: string, code = "VALIDATION_ERROR", field?: string) {
    super(message);

    this.name = "ValidationError";
    this.code = code;
    this.field = field;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateEmail(email: string): string {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new ValidationError("Email is required.", "EMAIL_REQUIRED", "email");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new ValidationError(
      "Enter a valid email address.",
      "INVALID_EMAIL",
      "email",
    );
  }

  return normalizedEmail;
}

function validatePassword(password: string): string {
  if (!password) {
    throw new ValidationError(
      "Password is required.",
      "PASSWORD_REQUIRED",
      "password",
    );
  }

  if (password.length < 8) {
    throw new ValidationError(
      "Password must contain at least 8 characters.",
      "PASSWORD_TOO_SHORT",
      "password",
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError(
      "Password must include at least one uppercase letter.",
      "PASSWORD_MISSING_UPPERCASE",
      "password",
    );
  }

  if (!/[a-z]/.test(password)) {
    throw new ValidationError(
      "Password must include at least one lowercase letter.",
      "PASSWORD_MISSING_LOWERCASE",
      "password",
    );
  }

  if (!/[0-9]/.test(password)) {
    throw new ValidationError(
      "Password must include at least one number.",
      "PASSWORD_MISSING_NUMBER",
      "password",
    );
  }

  return password;
}

function validateName(value: string, field: "firstName" | "lastName"): string {
  const normalizedName = value.trim();

  const readableField = field === "firstName" ? "First name" : "Last name";

  if (!normalizedName) {
    throw new ValidationError(
      `${readableField} is required.`,
      "NAME_REQUIRED",
      field,
    );
  }

  if (normalizedName.length < 2) {
    throw new ValidationError(
      `${readableField} must contain at least 2 characters.`,
      "NAME_TOO_SHORT",
      field,
    );
  }

  if (normalizedName.length > 60) {
    throw new ValidationError(
      `${readableField} cannot exceed 60 characters.`,
      "NAME_TOO_LONG",
      field,
    );
  }

  return normalizedName;
}

export function validateSignUpInput(input: SignUpInput): SignUpInput {
  if (!input.legalAccepted) {
    throw new ValidationError(
      "You must agree to the Terms of Service, Privacy Policy, and Platform Disclaimer.",
      "LEGAL_ACCEPTANCE_REQUIRED",
      "legalAccepted",
    );
  }

  const role =
    input.role === "customer" || input.role === "vendor" ? input.role : null;

  if (!role) {
    throw new ValidationError(
      "Please select a valid account type.",
      "INVALID_ROLE",
      "role",
    );
  }

  return {
    firstName: validateName(input.firstName, "firstName"),
    lastName: validateName(input.lastName, "lastName"),
    email: validateEmail(input.email),
    password: validatePassword(input.password),
    legalAccepted: true,
    role,
  };
}

export function validateSignInInput(input: SignInInput): SignInInput {
  return {
    email: validateEmail(input.email),

    password: input.password,
  };
}

export function validatePasswordResetEmail(email: string): string {
  return validateEmail(email);
}
