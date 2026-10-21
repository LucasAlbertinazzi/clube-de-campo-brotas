import { useRef, useState } from "react";
import {
  OFFLINE_STORAGE_KEY,
  prepareOfflineList,
  restoreOfflineList,
  scanOfflineList,
} from "./offline.mjs";

export function useOfflineGate(state, actions) {
  const [list, setList] = useState(() => {
    try {
      return restoreOfflineList(localStorage.getItem(OFFLINE_STORAGE_KEY));
    } catch {
      return null;
    }
  });
  const current = useRef(list);
  const [offline, setOffline] = useState(() =>
    Boolean(list?.entries.some((entry) => entry.status === "pending")),
  );
  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState("");
  const save = (next) => {
    current.current = next;
    setList(next);
    try {
      if (next) localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(OFFLINE_STORAGE_KEY);
      setStorageError("");
    } catch {
      setStorageError(
        "O navegador não conseguiu salvar a lista. Esta prévia permanece apenas enquanto a página está aberta.",
      );
    }
  };
  return {
    list,
    offline,
    setOffline,
    message,
    storageError,
    pending:
      list?.entries.filter((entry) => entry.status === "pending").length ?? 0,
    download(eventId) {
      const prepared = prepareOfflineList(state, eventId, current.current);
      if (prepared.error) {
        setMessage(prepared.error);
        return;
      }
      save(prepared.list);
      setMessage(
        "Lista preparada nesta demonstração. Agora simule o modo offline.",
      );
    },
    scan(code, eventId) {
      const checked = scanOfflineList(current.current, code, eventId);
      if (checked.list !== current.current) save(checked.list);
      return checked.result;
    },
    sync() {
      const result = actions.syncOffline(current.current);
      if (result.list) save(result.list);
      setOffline(false);
      setMessage(
        result.conflicts
          ? `${result.synced} entrada(s) sincronizada(s). ${result.conflicts} conflito(s) para conferência; a entrada já ocorrida offline não pode ser desfeita.`
          : `${result.synced} entrada(s) sincronizada(s) na demonstração. Sem pendências.`,
      );
    },
    reset() {
      save(null);
      setOffline(false);
      setMessage("");
    },
  };
}
