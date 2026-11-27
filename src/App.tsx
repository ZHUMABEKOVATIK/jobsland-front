import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuCompass } from "react-icons/lu";
import { AppShell } from "./components/AppShell";
import { EmptyState, PillButton } from "./components/ui";
import { CATEGORIES } from "./data/categories";
import { CreatePost } from "./pages/CreatePost";
import { Home } from "./pages/Home";
import { MyPosts } from "./pages/MyPosts";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home">
          <Route index element={<Home />} />
          {CATEGORIES.map((c) => (
            <Route key={c.id} path={c.path} element={<CreatePost key={c.id} category={c} />} />
          ))}
        </Route>
        <Route path="my-posts">
          <Route index element={<MyPosts />} />
          <Route path=":post_id" element={<PostDetail />} />
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="settings" element={<Navigate to="/profile" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={<LuCompass size={28} />}
      title={t("notFound.title")}
      body=""
      action={<PillButton tone="signal" onClick={() => navigate("/home")}>{t("notFound.action")}</PillButton>}
    />
  );
}
