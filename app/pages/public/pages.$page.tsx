import { settingsService } from "~/services/settings-service";
import type { Route } from "./+types";
import { data } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  // const product = await productService.findById(params.id!);
  return [{ title: `Locstique | ${params.page}` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const settings = await settingsService.get(params.page!);
  if (!settings) throw data({ message: "Product Not Found" }, 404);
  return { page: settings.value };
}

export default function Page({ loaderData: { page } }: Route.ComponentProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 leading-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{page?.title}</h1>
      <div className="" dangerouslySetInnerHTML={{ __html: page?.content }} />
    </div>
  );
}
