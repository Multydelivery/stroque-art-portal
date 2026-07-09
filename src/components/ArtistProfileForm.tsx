"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { splitList } from "@/lib/format";
import { artistProfileSchema } from "@/lib/validation";
import type { ArtistProfile } from "@/types/entities";

type Values = z.infer<typeof artistProfileSchema>;

export function ArtistProfileForm({ profile }: { profile: ArtistProfile }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      ...profile,
      portfolioImages: profile.portfolioImages || []
    }
  });

  async function uploadImage(file: File) {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!response.ok) {
      setMessage(data.error || "Upload failed.");
      return;
    }
    form.setValue("portfolioImages", [...form.getValues("portfolioImages"), data.url], { shouldDirty: true });
  }

  async function onSubmit(values: Values) {
    setMessage("");
    const response = await fetch("/api/artists/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    setMessage(response.ok ? "Profile saved." : "Could not save profile.");
    router.refresh();
  }

  const images = form.watch("portfolioImages");

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field">
          <label>Display name</label>
          <input {...form.register("displayName")} />
          <p className="error">{form.formState.errors.displayName?.message}</p>
        </div>
        <div className="field">
          <label>Location</label>
          <input {...form.register("location")} />
          <p className="error">{form.formState.errors.location?.message}</p>
        </div>
      </div>
      <div className="field">
        <label>Bio</label>
        <textarea rows={5} {...form.register("bio")} />
        <p className="error">{form.formState.errors.bio?.message}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="field">
          <label>Styles, comma separated</label>
          <input defaultValue={profile.styles.join(", ")} onChange={(event) => form.setValue("styles", splitList(event.target.value))} />
        </div>
        <div className="field">
          <label>Services, comma separated</label>
          <input defaultValue={profile.services.join(", ")} onChange={(event) => form.setValue("services", splitList(event.target.value))} />
        </div>
        <div className="field">
          <label>Starting price</label>
          <input type="number" {...form.register("startingPrice")} />
          <p className="error">{form.formState.errors.startingPrice?.message}</p>
        </div>
      </div>
      <div className="field">
        <label>Portfolio images</label>
        <input accept="image/*" type="file" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} />
        {uploading && <p className="text-sm text-stone-600">Uploading...</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div className="relative aspect-square overflow-hidden rounded-lg" key={url}>
              <Image alt="Portfolio upload" className="object-cover" fill src={url} />
            </div>
          ))}
        </div>
      </div>
      {message && <p className="text-sm text-stone-700">{message}</p>}
      <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white" type="submit">
        Save artist profile
      </button>
    </form>
  );
}
