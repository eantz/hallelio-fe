import { Suspense } from "react";
import { UserForm } from "./../../_form";
import { getUser } from "./../../fetcher";


export default async function EditUser({
  params
} : {
  params: Promise<{ id: number }>
}) {
  const userId = (await params).id
  const user = getUser(userId)

  return (
    <div className="w-1/2">
      <h1>Edit User</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <UserForm user={user} /> 
      </Suspense>
    </div>
  );
}
