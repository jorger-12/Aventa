"use client";

import { US_STATES } from "@/data/locations/usStates";

import { Checkbox, Field, FieldGroup, Input, Select } from "@/components/ui";

export interface LocationStepData {
  locationName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;

  servesAtCustomerLocation: boolean;
  serviceRadiusMiles: number;

  latitude: number | null;
  longitude: number | null;
  placeId: string;
}

interface LocationStepProps {
  value: LocationStepData;
  onChange: (value: LocationStepData) => void;
}

const SERVICE_RADIUS_OPTIONS = [
  { value: 10, label: "Up to 10 miles" },
  { value: 25, label: "Up to 25 miles" },
  { value: 50, label: "Up to 50 miles" },
  { value: 75, label: "Up to 75 miles" },
  { value: 100, label: "Up to 100 miles" },
  { value: 150, label: "Up to 150 miles" },
  { value: 250, label: "Up to 250 miles" },
];

export default function LocationStep({ value, onChange }: LocationStepProps) {
  function updateField<K extends keyof LocationStepData>(
    field: K,
    fieldValue: LocationStepData[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <>
      <FieldGroup
        title="Primary location"
        description="Add the main business address customers will see."
      >
        <Field
          label="Location name"
          htmlFor="locationName"
          helperText="Use a simple name such as Main location or Downtown location."
        >
          <Input
            id="locationName"
            type="text"
            value={value.locationName}
            onChange={(event) =>
              updateField("locationName", event.target.value)
            }
            placeholder="Main location"
            autoComplete="organization"
          />
        </Field>

        <Field label="Street address" htmlFor="street" required>
          <Input
            id="street"
            type="text"
            value={value.street}
            onChange={(event) => updateField("street", event.target.value)}
            placeholder="123 Main Street"
            autoComplete="street-address"
            required
          />
        </Field>

        <Field label="City" htmlFor="city" required>
          <Input
            id="city"
            type="text"
            value={value.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="El Paso"
            autoComplete="address-level2"
            required
          />
        </Field>

        <Field label="State" htmlFor="state" required>
          <Select
            id="state"
            value={value.state}
            onChange={(event) => updateField("state", event.target.value)}
            autoComplete="address-level1"
            required
          >
            <option value="">Select a state</option>

            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="ZIP code" htmlFor="zipCode" required>
          <Input
            id="zipCode"
            type="text"
            value={value.zipCode}
            onChange={(event) => updateField("zipCode", event.target.value)}
            placeholder="79901"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={10}
            required
          />
        </Field>

        <Field label="Country" htmlFor="country" required>
          <Select
            id="country"
            value={value.country}
            onChange={(event) => updateField("country", event.target.value)}
            autoComplete="country-name"
            required
          >
            <option value="US">United States</option>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup
        title="Service area"
        description="Set whether this business travels to customer locations."
      >
        <Checkbox
          id="servesAtCustomerLocation"
          checked={value.servesAtCustomerLocation}
          onChange={(event) =>
            updateField("servesAtCustomerLocation", event.target.checked)
          }
          label="This business travels to customers"
          helperText="Select this if the vendor provides services at homes, venues, offices, or other customer locations."
        />

        {value.servesAtCustomerLocation && (
          <Field
            label="Service radius"
            htmlFor="serviceRadiusMiles"
            helperText="This determines how far the business normally travels from its primary location."
          >
            <Select
              id="serviceRadiusMiles"
              value={value.serviceRadiusMiles}
              onChange={(event) =>
                updateField("serviceRadiusMiles", Number(event.target.value))
              }
            >
              {SERVICE_RADIUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </FieldGroup>

      <FieldGroup
        title="Location contact"
        description="Add contact details specific to this location when they differ from the main business contact."
      >
        <Field label="Location phone (optional)" htmlFor="locationPhone">
          <Input
            id="locationPhone"
            type="tel"
            value={value.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="(915) 555-1234"
            autoComplete="tel"
          />
        </Field>

        <Field label="Location email (optional)" htmlFor="locationEmail">
          <Input
            id="locationEmail"
            type="email"
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="location@business.com"
            autoComplete="email"
          />
        </Field>
      </FieldGroup>
    </>
  );
}
