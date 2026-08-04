// components/PrintOrder.tsx

import type { Order } from "../../types/Order.type";

interface PrintOrderProps {
  order: Order | null;
}

export default function PrintOrder({ order }: PrintOrderProps) {
  if (!order) return null;

  return (
    <div id="print-order" className="print-only">
      <h2>Pedido #{order.code}</h2>
      <p><strong>Tipo:</strong> {order.type}</p>
      <p><strong>Cliente:</strong> {order.costumerName}</p>
      <p><strong>Telefone:</strong> {order.costumerPhone}</p>

      {order.type === "DELIVERY" && (
        <>
          <p><strong>Endereço:</strong> {order.costumerAddress?.streetName}, {order.costumerAddress?.number}</p>
          <p><strong>Bairro:</strong> {order.neighborhood?.neighborhoodName}</p>
        </>
      )}

      <hr />

      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "center" }}>Qtd</th>
            <th style={{ textAlign: "right" }}>Preço</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, i) => (
            <tr key={i}>
              <td>
                {item.name}
                {item.flavors && item.flavors.length > 0 && (
                  <div style={{ fontSize: "0.85em", marginLeft: 8 }}>
                    {item.flavors.map((f) => f.product?.productName).join(" + ")}
                  </div>
                )}
              </td>
              <td style={{ textAlign: "center" }}>{item.quantity}</td>
              <td style={{ textAlign: "right" }}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <p><strong>Forma de pagamento:</strong> {order.paymentMethod}</p>
      {order.changeFor > 0 && (
        <p><strong>Troco para:</strong> R$ {order.changeFor.toFixed(2)}</p>
      )}
      {order.discount > 0 && (
        <p><strong>Desconto:</strong> R$ {order.discount.toFixed(2)}</p>
      )}
      <p style={{ fontSize: "1.2em" }}>
        <strong>Total: R$ {Number(order.orderTotal).toFixed(2)}</strong>
      </p>

      {order.observation && (
        <p><strong>Observação:</strong> {order.observation}</p>
      )}
    </div>
  );
}