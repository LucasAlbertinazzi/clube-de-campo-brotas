import { useState } from "react";
import { useDemo } from "../lib/DemoContext.jsx";
import { formatMoney } from "../lib/model.mjs";
import { Button, DemoNote, Icon, Modal, Tabs } from "./ui.jsx";
import QrCode from "./QrCode.jsx";

export default function PaymentModal({ bill, onClose }) {
  const [method, setMethod] = useState("pix");
  const { actions } = useDemo();
  return (
    <Modal title="Pagamento de demonstração" onClose={onClose}>
      <p className="modal-intro">
        {bill.reference}
        <strong className="payment-amount">{formatMoney(bill.amount)}</strong>
      </p>
      <Tabs
        label="Forma de pagamento demonstrativa"
        value={method}
        onChange={setMethod}
        items={[
          { id: "pix", label: "Pix", icon: "qr" },
          { id: "boleto", label: "Boleto", icon: "file" },
          { id: "card", label: "Cartão", icon: "card" },
        ]}
      />
      <div className="payment-preview">
        {method === "pix" ? (
          <>
            <QrCode
              value="DEMONSTRACAO-SEM-PAGAMENTO-CCB"
              label="QR ilustrativo sem função de pagamento"
            />
            <p>QR ilustrativo, sem função de pagamento.</p>
          </>
        ) : method === "boleto" ? (
          <>
            <Icon name="file" size={44} />
            <h3>Boleto demonstrativo</h3>
            <p>
              Na experiência final, o boleto será disponibilizado pelo banco ou
              provedor contratado.
            </p>
          </>
        ) : (
          <>
            <Icon name="card" size={44} />
            <h3>Pagamento com cartão</h3>
            <p>
              A confirmação será realizada com o provedor contratado. Esta
              prévia não solicita dados de cartão.
            </p>
          </>
        )}
      </div>
      <Button
        className="button-full"
        onClick={() => {
          actions.payBill(bill.id);
          onClose();
        }}
        icon="check"
      >
        Simular pagamento
      </Button>
      <DemoNote>
        Nenhum valor será cobrado. Apenas o histórico desta prévia será
        atualizado.
      </DemoNote>
    </Modal>
  );
}
