import { sessionService } from "~/services/session-service.server";
import type { Route } from "./+types/logout";
import { commitSession, getSession } from "~/session.server";
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");

  if (sessionId) {
    await sessionService.invalidate(sessionId);
    session.unset("userId");
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
