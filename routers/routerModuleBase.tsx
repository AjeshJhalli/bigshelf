import { Router } from "jsr:@oak/oak/router";
import { render } from "https://cdn.skypack.dev/preact-render-to-string@v5.1.12";
import r from "../utils/r.tsx";
import EditFormModal, { FormField } from "../components/EditFormModal.tsx";
import formInventoryItem from "../forms/formInventoryItem.ts";
import ViewForm from "../components/ViewForm.tsx";

type RouterModuleBaseOptions = {
  name: string;
  displayName: string;
  getAll: (tenantId: string) => any;
  getOne: (tenantId: string, recordId: string) => any;
  update: (tenantId: string, record: any) => any;
  create: (tenantId: string, record: any) => any;
  delete: (tenantId: string, recordId: string) => any;
  recordColumns: Array<{ name: string; displayName: string }>;
  form: (record: any) => Array<FormField>;
  validateForm: (data: FormData) => any;
};

export default function routerModuleBase(options: RouterModuleBaseOptions) {
  const router = new Router();

  router
    .get("/", async (context) => {
      const tenantId = context.state.tenantId;

      const records = await options.getAll(tenantId);

      context.response.body = render(
        <ViewForm
          title={options.displayName}
          newHref={`/${options.name}/new`}
          columns={options.recordColumns.map((column) => column.displayName)}
          records={records.map((record) => ({
            editHref: `/${options.name}/${record.id}/edit`,
            fields: options.recordColumns.map((column) => record[column.name]),
          }))}
        />
      );
    })
    .get("/:recordId/edit", async (context) => {
      const tenantId = context.state.tenantId;
      const recordId = context.params.recordId;

      const record = await options.getOne(tenantId, recordId);

      if (!record) {
        context.response.status = 400;
        return;
      }

      const fields = options.form(record);

      context.response.body = render(
        <EditFormModal
          fields={fields}
          saveHref={`/${options.name}/${recordId}/edit`}
          deleteHref={`/${options.name}/${recordId}`}
        />,
      );
    })
    .post("/:recordId/edit", async (context) => {
      const tenantId = context.state.tenantId;
      const recordId = context.params.recordId as string;

      const record = await options.getOne(tenantId, recordId);

      if (!record) {
        context.response.status = 400;
        return;
      }

      const validatedForm = options.validateForm(
        await context.request.body.formData(),
      );

      if (!validatedForm) {
        context.response.status = 400;
        return;
      }

      const newItem = { ...record, ...validatedForm };

      await options.update(tenantId, newItem);

      context.response.redirect(`/${options.name}`);
    })
    .get("/new", (context) => {
      context.response.body = render(
        <EditFormModal
          fields={formInventoryItem({
            id: "",
            name: "",
            type: "",
            quantity: 1,
            allocations: [],
          })}
          saveHref={`/${options.name}/new`}
        />,
      );
    })
    .post("/new", async (context) => {
      const tenantId = context.state.tenantId;

      const validatedForm = options.validateForm(
        await context.request.body.formData(),
      );

      if (!validatedForm) {
        context.response.status = 400;
        return;
      }

      await options.create(tenantId, validatedForm);

      context.response.redirect(`/${options.name}`);
    })
    .delete(`/:recordId`, async (context) => {
      const tenantId = context.state.tenantId;
      const recordId = context.params.recordId as string;

      await options.delete(tenantId, recordId);
      context.response.headers.append("HX-Redirect", `/${options.name}`);
    });

  return router;
}
