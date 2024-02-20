import { MercadoPagoConfig } from 'mercadopago';
import { redirect } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN!});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SECRET_KEY!);


export default async function Home() {
  const donations = await supabase
  .from("donations")
  .select("*")
  .then(({ data }) => data as { id: string, amount: number, message: string }[]);


  async function donate(formData: FormData) {
    "use server";

    const preference = await new Preference(client)
    .create({
      body: {
        items: [
          {
            id:"donation",
            title: formData.get('message') as string,
            quantity: 1,
            unit_price: Number(formData.get('amount'))
          }
        ],
      }
    })
     redirect(preference.sandbox_init_point!) 

  }

  return (
    <section className='grid gap-12'>
     <form action={donate} className="m-auto grid max-w-96 gap-8 border p-4">
      <Label className="grid gap-2">
        <span>Valor</span>
        <Input type="number" name="amount"/>
      </Label>
      <Label className="grid gap-2">
        <span>Tu mensaje de la donacion</span>
        <Textarea name="message"/>
      </Label>
      <Button type="submit">Enviar</Button>
    </form> 
    <Table>
  
  <TableHeader>
    <TableRow>
      <TableHead>Cantidad</TableHead>
      <TableHead className="text-right">Mensaje</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {donations.map((donation) => {
      return (
        <TableRow key={donation.id}>
      <TableCell className="font-bold">{donation.amount.toLocaleString('es-AR', {style:"currency", currency:"ARS"})}</TableCell>
      <TableCell className="text-right">{donation.message}</TableCell>
    </TableRow>
      );
    })}   
  </TableBody>
</Table>

    </section>
    
    
  );
}
