import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useState} from "react";
import {FiEdit, FiSave, FiTrash} from "react-icons/fi";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
];

export const AllDepartments = () => {
  const [isEditRow, setIsEditRow] = useState(false);

  const handleEdit = () => {
    setIsEditRow(prev => !prev);
  };
  return (
    <div className="w-1/3 mx-auto my-2 px-5 pb-2 shadow-md shadow-teal-400 rounded-md">
      <h2 className="font-semibold text-xl text-center uppercase">
        all departments
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Department Name</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.invoice}>
              <TableCell>{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell className="flex gap-2">
                <button onClick={handleEdit}>
                  {isEditRow ? <FiSave /> : <FiEdit />}
                </button>
                <button>
                  <FiTrash />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
