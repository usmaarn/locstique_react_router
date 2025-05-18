import { uploadService } from "~/services/file-service.server";
import type { Route } from "./+types/upload";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  return await uploadService.saveTemp(file);
  return "";
}
