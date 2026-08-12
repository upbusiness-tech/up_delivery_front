import { useState } from 'react';
import type { Order } from '../../../../types/Order.type';
import { moneyMask } from '../../../../utils/masks/mask';
import { PaymentSevice } from '../../../../api/services/payment.service';

interface UseCashScreenControllerProps {
  order: Order;
  total: number;
  onBack: () => void;
}

export function useCashScreenController({ total, onBack, order }: UseCashScreenControllerProps) {
  const [changeFor, setChangeFor] = useState<number>(0);
  const [noChange, setNoChange] = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<boolean>(false)

  const troco = changeFor > total ? changeFor - total : 0;
  const insufficient = touched && !noChange && changeFor > 0 && changeFor < total;
  const canConfirm = noChange || changeFor >= total;

  const formattedChangeFor = changeFor === 0 ? '' : moneyMask(changeFor).replace('R$', '').trim();

  const handleChangeForInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    setChangeFor(digits ? Number(digits) / 100 : 0);
    if (!touched) setTouched(true);
  };

  const handleBlur = () => setTouched(true);

  const handleNoChangeToggle = (checked: boolean) => {
    setNoChange(checked);
    if (checked) {
      setChangeFor(0);
      setTouched(false);
    }
  };

  async function handleConfirm(){
    try {
      const response = await PaymentSevice.createCashPayment(order.id)
      if(response){setStatus(true)}
    }catch(err){
      console.log(err)
    }
  };

  return {
    changeFor,
    noChange,
    touched,
    troco,
    insufficient,
    canConfirm,
    formattedChangeFor,
    total,
    onBack,
    handleChangeForInput,
    handleBlur,
    handleNoChangeToggle,
    handleConfirm,
    status
  };
}