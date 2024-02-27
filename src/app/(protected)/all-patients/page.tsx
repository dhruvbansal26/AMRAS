import { db } from "@/lib/db";
import { auth } from "@/auth";
import { DataTable } from "./data-table";
import { columns } from "./columns";
const AllPatientsPage = async () => {
  const session = await auth();
  const data = await db.user.findMany({
    where: {
      id: session?.user.id || undefined,
    },
    include: {
      patients: true,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data[0].patients} />
    </div>
  );
};
export default AllPatientsPage;
