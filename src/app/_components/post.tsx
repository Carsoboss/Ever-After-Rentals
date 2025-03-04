"use client";

import { useState } from "react";
import { categoryEnum } from "~/server/db/schema";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<typeof categoryEnum.enumValues[number]>("SPECIALTY_ITEMS");
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState(0);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setDescription("");
      setCategory("SPECIALTY_ITEMS");
      setQuantity(0);
      setValue(0);
      setPrice(undefined);
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ 
            name,
            description,
            category,
            quantity,
            value,
            price,
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof categoryEnum.enumValues[number])}
          className="w-full rounded-full px-4 py-2 text-black"
        >
          {categoryEnum.enumValues.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="number"
          placeholder="Price"
          value={price === undefined ? "" : price.toString()}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
