"use server";

import { z } from "zod";
import { db } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const client = await db.connect();

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please enter an amount greater than $0",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0" }),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await client.sql`INSERT INTO invoices (customer_id,amount,status,date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");

  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { amount, customerId, status } = validatedFields?.data;
  const amountInCents = amount * 100;

  try {
    await client.sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
    `;
  } catch (error) {
    console.log("Error encountered");
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await client.sql`
    DELETE FROM invoices
    WHERE id = ${id + 1}
    `;
  } catch (error) {
    console.log("failed to delete invoice", error);
  }

  revalidatePath("/dashboard/invoices");
}
