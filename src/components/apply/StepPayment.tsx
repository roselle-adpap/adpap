import { useRef, useState } from "react";
import { PaymentInfo } from "@/types";
import { TextField, FieldsetTitle } from "@/components/form/Field";
import { PAYMENT_METHODS, DEFAULT_PAYMENT_NOTICE } from "@/data/paymentConfig";
import { formatPHP } from "@/data/membershipPlans";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface Props {
  amountDue: number;
  data: PaymentInfo;
  errors: Partial<Record<keyof PaymentInfo, string>>;
  onChange: (patch: Partial<PaymentInfo>) => void;
}

export default function StepPayment({ amountDue, data, errors, onChange }: Props) {
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enabledMethods = PAYMENT_METHODS.filter((m) => m.enabled);
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === data.method);
  const isBillCompany = data.method === "bill_company";

  async function handleFile(file: File | null) {
    setFileError(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please upload a JPG, PNG, or PDF file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFileError("File is too large. Maximum size is 5MB.");
      return;
    }
    const base64 = await fileToBase64(file);
    onChange({ proofFileName: file.name, proofFileBase64: base64, proofFileType: file.type });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-navy-950">Payment</h2>
        <p className="mt-1.5 text-sm text-navy-700/65">
          Membership fee due:{" "}
          <span className="font-semibold text-navy-950">{formatPHP(amountDue)}</span>
        </p>
      </div>

      <div className="rounded-lg border border-royal-600/20 bg-royal-600/5 p-5">
        <p className="text-sm leading-relaxed text-royal-700">
          {activeMethod?.instructions ?? DEFAULT_PAYMENT_NOTICE}
        </p>
        {activeMethod && (activeMethod.accountName || activeMethod.accountNumber) && (
          <div className="mt-3 grid gap-1 text-sm text-navy-800">
            {activeMethod.bankName && <p><strong>Bank:</strong> {activeMethod.bankName}</p>}
            {activeMethod.accountName && <p><strong>Account Name:</strong> {activeMethod.accountName}</p>}
            {activeMethod.accountNumber && <p><strong>Account Number:</strong> {activeMethod.accountNumber}</p>}
          </div>
        )}
      </div>

      <section>
        <FieldsetTitle>Payment method</FieldsetTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {(enabledMethods.length ? enabledMethods : PAYMENT_METHODS.filter((m) => m.id === "other")).map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => onChange({ method: m.id })}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                data.method === m.id
                  ? "border-royal-600 bg-royal-600/5 text-royal-700"
                  : "border-navy-900/12 text-navy-800 hover:border-royal-600/40"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {errors.method && <p className="field-error">{errors.method}</p>}
      </section>

      {isBillCompany ? (
        <section>
          <FieldsetTitle subtitle="The Secretariat will send an invoice to the person and email address below.">
            Company billing details
          </FieldsetTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Company Name" required value={data.billingCompanyName ?? ""}
              error={errors.billingCompanyName} onChange={(e) => onChange({ billingCompanyName: e.target.value })}
              className="sm:col-span-2" />
            <TextField label="Person to be Billed" required value={data.billingContactPerson ?? ""}
              error={errors.billingContactPerson} onChange={(e) => onChange({ billingContactPerson: e.target.value })} />
            <TextField label="Mobile Number" required value={data.billingMobile ?? ""}
              error={errors.billingMobile} onChange={(e) => onChange({ billingMobile: e.target.value })} />
            <TextField label="Email Address" type="email" required value={data.billingEmail ?? ""}
              error={errors.billingEmail} onChange={(e) => onChange({ billingEmail: e.target.value })}
              className="sm:col-span-2" />
            <TextField label="Company Address" required value={data.billingCompanyAddress ?? ""}
              error={errors.billingCompanyAddress} onChange={(e) => onChange({ billingCompanyAddress: e.target.value })}
              className="sm:col-span-2" />
          </div>
        </section>
      ) : (
        <>
          <section>
            <FieldsetTitle>Payment details</FieldsetTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Amount Paid (₱)" type="number" min={0} required value={data.amountPaid}
                error={errors.amountPaid} onChange={(e) => onChange({ amountPaid: e.target.value })} />
              <TextField label="Payment Date" type="date" required value={data.paymentDate}
                error={errors.paymentDate} onChange={(e) => onChange({ paymentDate: e.target.value })} />
              <TextField label="Reference Number" required value={data.referenceNumber}
                error={errors.referenceNumber} onChange={(e) => onChange({ referenceNumber: e.target.value })} />
              <TextField label="Name appearing on payment" required value={data.payorName}
                error={errors.payorName} onChange={(e) => onChange({ payorName: e.target.value })} />
            </div>
          </section>

          <section>
            <FieldsetTitle subtitle="Optional — accepted formats: JPG, JPEG, PNG, PDF, up to 5MB. Don't have it on hand? You can skip this and email it to the Secretariat afterward.">
              Proof of payment
            </FieldsetTitle>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy-900/15 bg-mist-50 px-6 py-10 text-center transition hover:border-royal-600/50"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-2 text-navy-700/40">
                <path d="M12 16V4M12 4 7 9M12 4l5 5" />
                <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
              </svg>
              {data.proofFileName ? (
                <p className="text-sm font-medium text-royal-700">{data.proofFileName} — click to replace</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-navy-800">Click to upload, or drag and drop</p>
                  <p className="mt-1 text-xs text-navy-700/50">JPG, PNG or PDF, up to 5MB — optional</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
            {fileError && <p className="field-error">{fileError}</p>}
            {!data.proofFileName && (
              <p className="mt-2 text-xs text-navy-700/50">
                No attachment yet? That's fine — you can proceed to the next step now and send your
                proof of payment to{" "}
                <a href="mailto:secretariat@gkphilippines.com" className="text-royal-600 hover:underline">
                  secretariat@gkphilippines.com
                </a>{" "}
                afterward.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
