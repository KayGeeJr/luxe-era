"use client";

import { useCallback, useEffect, useState } from "react";
import { isMockCatalogEnabled } from "../data/mockCatalog";
import { api } from "../lib/api";
import { CART_UPDATED_EVENT } from "../lib/cartEvents";
import { getMockCartCount } from "../lib/mockCart";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);

  const refresh = useCallback(async () => {
    if (isMockCatalogEnabled()) {
      setCount(getMockCartCount());
      return;
    }
    try {
      const data = await api.getCart();
      const items = data?.cart?.items || [];
      setCount(items.reduce((sum, item) => sum + Number(item.quantity || 0), 0));
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();

    let bumpTimer;
    const handleUpdate = () => {
      refresh();
      setBump(true);
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(() => setBump(false), 550);
    };

    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearTimeout(bumpTimer);
    };
  }, [refresh]);

  return { count, bump };
}
