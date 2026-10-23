import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function AddUserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This computer only</CardTitle>
        <p className="text-sm text-muted">
          Hotel Status Residency keeps the books on this computer. There is no cloud
          account and no sign-in. Use the security code below to lock edits.
        </p>
      </CardHeader>
    </Card>
  );
}
