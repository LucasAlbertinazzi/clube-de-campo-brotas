import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  STORAGE_KEY,
  confirmBill,
  createEvent,
  createInitialState,
  issueGuestTicket,
  issueTicket,
  restoreState,
  validateTicket,
} from "./model.mjs";
import { syncOfflineList } from "./offline.mjs";
import {
  visitorSeed,
  createVisitorProfile,
  signInVisitor,
  issueVisitorTicket,
} from "./visitors.mjs";

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      return restoreState(localStorage.getItem(STORAGE_KEY));
    } catch {
      return createInitialState();
    }
  });
  const current = useRef(state);
  const [toast, setToast] = useState("");
  const [experience, setExperience] = useState("member");
  const [demoPackage, setDemoPackage] = useState("web");
  const [memberPage, setMemberPage] = useState("bills");
  const [adminPage, setAdminPage] = useState("events");
  const [appPage, setAppPage] = useState("tickets");
  const [appAudience, setAppAudience] = useState("member");
  const [visitorProfile, setVisitorProfile] = useState(visitorSeed);
  const [visitorSession, setVisitorSession] = useState(null);
  const [visitorEventId, setVisitorEventId] = useState(null);
  const commit = useCallback((next) => {
    current.current = next;
    setState(next);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* The demo also works without browser storage. */
    }
  }, [state]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY && event.newValue)
        commit(restoreState(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [commit]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);
  const notify = useCallback((message) => setToast(message), []);
  const actions = {
    signInVisitor(email, code) {
      const result = signInVisitor(visitorProfile, email, code);
      if (result.profile) setVisitorSession(result.profile);
      return result;
    },
    registerVisitor(input) {
      const result = createVisitorProfile(input);
      if (result.profile) {
        setVisitorProfile(result.profile);
        setVisitorSession(result.profile);
      }
      return result;
    },
    signOutVisitor() {
      setVisitorSession(null);
    },
    buyVisitorTicket(eventId, confirmed) {
      const result = issueVisitorTicket(
        current.current,
        eventId,
        visitorSession,
        confirmed,
      );
      if (result.ticket && !result.error) commit(result.state);
      return result;
    },
    addEvent(input) {
      const result = createEvent(
        current.current,
        input,
        `evento-${crypto.randomUUID()}`,
      );
      if (!result.error) commit(result.state);
      return result;
    },
    publishEvent(id) {
      commit({
        ...current.current,
        events: current.current.events.map((event) =>
          event.id === id ? { ...event, status: "published" } : event,
        ),
      });
      notify("Evento publicado na demonstração.");
    },
    issue(eventId, personId, confirmed) {
      const result = issueTicket(current.current, eventId, personId, confirmed);
      if (result.ticket && !result.error) commit(result.state);
      return result;
    },
    issueGuest(eventId, name, confirmed) {
      const result = issueGuestTicket(
        current.current,
        eventId,
        name,
        confirmed,
      );
      if (result.ticket && !result.error) commit(result.state);
      return result;
    },
    scan(code, eventId) {
      const { state: next, result } = validateTicket(
        current.current,
        code,
        eventId,
      );
      if (next !== current.current) commit(next);
      return result;
    },
    syncOffline(list) {
      const result = syncOfflineList(current.current, list);
      if (result.state !== current.current) commit(result.state);
      return result;
    },
    payBill(id) {
      commit(confirmBill(current.current, id));
      notify("Pagamento simulado. O histórico foi atualizado.");
    },
    resetCheckins() {
      commit({
        ...current.current,
        tickets: current.current.tickets.map((ticket) =>
          ticket.status === "used"
            ? { ...ticket, status: "available" }
            : ticket,
        ),
        checkins: [],
      });
      notify("Leituras de demonstração reiniciadas.");
    },
    updateFamily(id, name) {
      const clean = name.trim().slice(0, 60);
      if (!clean) return false;
      commit({
        ...current.current,
        family: current.current.family.map((person) =>
          person.id === id
            ? {
                ...person,
                name: clean,
                initials: clean
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join(""),
              }
            : person,
        ),
      });
      notify("Cadastro atualizado nesta demonstração.");
      return true;
    },
    sendMessage(subject, body) {
      const message = {
        id: crypto.randomUUID(),
        subject: subject.trim().slice(0, 80),
        body: body.trim().slice(0, 1000),
        status: "Recebido",
        at: new Date().toISOString(),
      };
      if (!message.subject || !message.body) return false;
      commit({
        ...current.current,
        messages: [message, ...current.current.messages],
      });
      notify("Mensagem registrada apenas na demonstração.");
      return true;
    },
    addPost(title, body) {
      const post = {
        id: crypto.randomUUID(),
        title: title.trim().slice(0, 80),
        body: body.trim().slice(0, 400),
        image: "clube-paisagem.jpeg",
      };
      if (!post.title || !post.body) return false;
      commit({ ...current.current, posts: [post, ...current.current.posts] });
      notify("Publicação adicionada ao site de demonstração.");
      return true;
    },
    reset() {
      commit(createInitialState());
      notify("Demonstração reiniciada.");
    },
  };
  return (
    <DemoContext.Provider
      value={{
        state,
        actions,
        notify,
        demoPackage,
        setDemoPackage,
        experience,
        setExperience,
        memberPage,
        setMemberPage,
        adminPage,
        setAdminPage,
        appPage,
        setAppPage,
        appAudience,
        setAppAudience,
        visitorProfile,
        visitorSession,
        visitorEventId,
        setVisitorEventId,
      }}
    >
      {children}
      <div
        className={`toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
