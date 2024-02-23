import { db } from "@/lib/db";
import { auth } from "@/auth";
import { PatientCard } from "../_components/patient-card";

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
    <div className="p-4 flex flex-col space-y-4 h-full">
      {data[0].patients.map((patient) => (
        <PatientCard
          key={patient.id}
          id={patient.id}
          name={patient.name}
          age={patient.age}
          score={patient.score}
          specialCare={patient.specialCare}
          hospitalId={patient.hospitalId}
          ecmoType={patient.ecmoType}
        />
      ))}
    </div>
  );
};
export default AllPatientsPage;
