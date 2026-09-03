import { useRestaurant } from "../../context/RestaurantContext";
import type { Order, OrderItem } from "../../types/Order.type";
import type { ProducSize } from "../../types/Product.type";
import { paymentMethodMask } from "../masks/mask";

interface PrintOrderProps {
  order: Order | null;
}

export default function PrintOrder({ order }: PrintOrderProps) {
  if (!order) return null;

  const { products, restaurant } = useRestaurant();

  function getProductNameByProductSize(flavor: string | ProducSize): string {
    const targetId = typeof flavor === "string" ? flavor : flavor.id;
    const product = products?.find((p) => p.sizes.some((ps) => ps.id === targetId));
    return product?.productName ?? "Sabor não encontrado";
  }

  function getItemFlavorLines(item: OrderItem): string[] {
    if (!item.flavors || item.flavors.length === 0) return [];

    const firstSize = getSizeByFlavorId(item.flavors[0]);
    const limitFlavors = firstSize?.limitFlavors ?? item.flavors.length;

    const flavors = item.flavors.length === 1 && limitFlavors > 1
      ? Array(limitFlavors).fill(item.flavors[0])
      : item.flavors;

    return flavors.map((flavor, index) => `${index + 1}/${limitFlavors} ${getProductNameByProductSize(flavor)}`);
  }

  function getSizeByFlavorId(flavorId: string) {
    const product = products?.find((p) => p.sizes.some((ps) => ps.id === flavorId));
    return product?.sizes.find((ps) => ps.id === flavorId)?.size;
  }

  function formatMoney(value: number | string | undefined | null) {
    return Number(value ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const now = new Date();
  const itemsTotal = order.items?.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0) ?? 0;

  return (
    <div id="print-order" className="print-only" style={{ width: "100%", maxWidth: "80mm", padding: "4mm", boxSizing: "border-box", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "13px", color: "#000", background: "#fff" }}>
      <div style={{ textAlign: "center", lineHeight: 1.2, marginBottom: 8 }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase" }}>{restaurant?.restaurantName}</div>
        <div style={{ fontSize: "11px", fontWeight: "bold", marginTop: 3 }}>
          {now.toLocaleDateString("pt-BR")} {now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div style={{ border: "2px solid #000", padding: "6px 5px", textAlign: "center", marginBottom: 9 }}>
        <div style={{ fontSize: "11px", fontWeight: "bold" }}>NOVO PEDIDO!</div>
        <div style={{ fontSize: "13px", fontWeight: "bold", marginTop: 3 }}>{order.type === "DELIVERY" ? "ENTREGA" : "RETIRADA"}</div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: 4 }}>CLIENTE</div>
        <div style={{ fontWeight: "bold", fontSize: "17px" }}>Nome: {order.costumerName}</div>
        <div style={{ fontWeight: "bold", fontSize: "17px" }}>Telefone: {order.costumerPhone}</div>

        {order.type === "delivery" && (
          <>
            <div style={{ marginTop: 3, fontWeight: "bold", fontSize: "17px" }}>Rua: {order.costumerAddress?.streetName}, {order.costumerAddress?.number}</div>
            {order.neighborhood?.neighborhoodName && <div style={{ fontSize: "17px", fontWeight: "bold"}}>Bairro: {order.neighborhood.neighborhoodName}</div>}
          </>
        )}
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }} />

      <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: 5 }}>ITENS DO PEDIDO</div>

      {order.items?.map((item, i) => {
        const flavorLines = getItemFlavorLines(item);
        const itemTotal = Number(item.price) * Number(item.quantity);

        return (
          <div key={i} style={{ marginBottom: 9, pageBreakInside: "avoid" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 5 }}>
              <div style={{ flex: 1, fontWeight: "bold", lineHeight: 1.2, fontSize: 18 }}>{item.name}</div>
              <div style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>R$ {formatMoney(itemTotal)}</div>
            </div>

            <div style={{ fontSize: "14px", marginTop: 2, fontWeight: 'bold'}}>{item.quantity} x R$ {formatMoney(item.price)}</div>

            {flavorLines.length > 0 && (
              <div style={{ marginTop: 4, marginLeft: 8, fontSize: "11px", lineHeight: 1.35 }}>
                {/* <div style={{ fontWeight: "bold", marginBottom: 2 }}>SABORES:</div> */}
                {flavorLines.map((line, idx) => <div style={{fontSize: "14px", fontWeight: "bold"}} key={idx}>• {line}</div>)}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }} />

      <div style={{ fontSize: "14px", lineHeight: 1.5 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Subtotal:</span>
        <span>R$ {formatMoney(itemsTotal)}</span>
      </div>

      {order.type === "delivery" && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{fontWeight: "bold"}}>Taxa de entrega:</span>
          <span style={{fontWeight: "bold"}}>R$ {formatMoney(order.neighborhood.deliveryFee)}</span>
        </div>
      )}


      {Number(order.discount) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Desconto:</span>
          <span>- R$ {formatMoney(order.discount)}</span>
        </div>
      )}

      <div style={{ borderTop: "1px dashed #000", marginTop: 5, paddingTop: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>PAGAMENTO:</span>
          <span>{paymentMethodMask(order.paymentMethod)}</span>
        </div>

        {Number(order.changeFor) > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <span>TROCO PARA:</span>
            <span>R$ {formatMoney(order.changeFor)}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginTop: 5, paddingTop: 5, borderTop: "1px solid #000" }}>
          <span>TOTAL:</span>
          <span>R$ {formatMoney(order.orderTotal + (order.neighborhood?.deliveryFee ?? 0))}</span>
        </div>
      </div>
    </div>

      {order.observation && (
        <div style={{ border: "1px solid #000", padding: 6, marginTop: 8, pageBreakInside: "avoid" }}>
          <div style={{ fontWeight: "bold", fontSize: "11px", marginBottom: 3 }}>OBSERVAÇÃO</div>
          <div style={{ fontSize: "12px", lineHeight: 1.35 }}>{order.observation}</div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 12, paddingTop: 7, borderTop: "1px dashed #000", fontSize: "9px", lineHeight: 1.4 }}>
        <div style={{ fontWeight: "bold" }}>PEDIDO GERADO VIA UPDELIVERY</div>
      </div>
    </div>
  );
}