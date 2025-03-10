import { MemberForm } from "./../../_form";
import { getMember } from "./actions";


export default async function AddMember({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const memberId = (await params).id
  const member = getMember(memberId)

  return (
    <div className="w-1/2">
      <h1>Edit Member</h1>
      
      <MemberForm member={member} />
    </div>
  );
}
