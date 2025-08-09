import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      <TransactionForm />
      <TransactionList />
    </div>
  );
}
