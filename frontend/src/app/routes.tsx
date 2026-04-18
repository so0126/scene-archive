import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Upload } from "./pages/Upload";
import { Editor } from "./pages/Editor";
import { Order } from "./pages/Order";
import { OrderLookup } from "./pages/OrderLookup";
import { Success } from "./pages/Success";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/upload",
    Component: Upload,
  },
  {
    path: "/editor",
    Component: Editor,
  },
  {
    path: "/order",
    Component: Order,
  },
  {
    path: "/success",
    Component: Success,
  },
  {
    path: "/order-lookup",
    Component: OrderLookup,
  },
]);
