import classNames from "https://deno.land/x/classnames@0.1.1/index.ts";

export default function RelatedList(
  {
    items,
    display,
    extraButtons,
    editFormHref,
  },
) {
  return (
    <section>
      <table class="">
        <tbody>
          {items && items.map((item) => (
            <tr className="">
              <td>
                {item.href
                  ? (
                    <a href={item.href} className="">
                      {display(item)}
                    </a>
                  )
                  : (
                    <span>
                      {display(item)}
                    </span>
                  )}
              </td>
              <td>
                {extraButtons}
                <button
                  className=""
                  hx-get={`${editFormHref}/${item.id}`}
                  hx-target="body"
                  hx-swap="beforeend"
                >
                  edit
                </button>
                <button className="">
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
