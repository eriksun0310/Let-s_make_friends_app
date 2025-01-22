import { useEffect } from "react";
import { AppState } from "react-native";
import { fetchAllData } from "shared/fetchData";
import {
  initialState,
  selectIsAuthenticated,
  selectUser,
  setInitialized,
  setIsAuthenticated,
  setIsNewUser,
  setUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { AppDispatch, AppThunk } from "store/store";
import { getUserDetail } from "util/handleUserEvent";
import { supabase } from "util/supabaseClient";

// 登出(將 logout 定義為一個 thunk，用來登出用戶(因為非同步操作，所以用 thunk)
export const logout = () => async (dispatch: any) => {
  try {
    await supabase.auth.signOut();
    dispatch(setUser(initialState.user)); // 清除用戶信息
    dispatch(setIsAuthenticated(false)); // 設置為未認證

    return Promise.resolve();
  } catch (error) {
    console.log("error", error);
    return Promise.reject(error);
  }
};

// 初始化(用來在每次應用程式啟動時檢查 Supabase 認證狀態)
export const initializeAuth = (): AppThunk => async (dispatch) => {
  try {
    // const session = supabase.auth.session();
    // 使用 onAuthStateChange 來監聽認證狀態變化
    supabase.auth.onAuthStateChange(async (event, session) => {
      // 不管是註冊還是登入都會有 session
      if (session) {
        const user = session.user;
        const { data: userData } = await getUserDetail({
          userId: user.id,
        }); // 取得用戶資料

        // 舊用戶登入
        if (userData) {
          dispatch(setUser(userData));
          dispatch(setIsNewUser(false));
          // 更新用戶資料
          await fetchAllData({
            dispatch: dispatch as AppDispatch,
            userId: user.id,
          });
        } else {
          // 新用戶登入

          dispatch(
            setUser({
              userId: user.id,
              email: user.email,
            })
          );
          dispatch(setIsNewUser(true));
        }

        dispatch(setIsAuthenticated(true)); // 設置用戶為已認證
      } else {
        // 用戶未登入
        dispatch(setIsAuthenticated(false)); // 設置用戶為未認證
      }

      // 初始化完成
      dispatch(setInitialized(true));
    });
  } catch (err) {
    console.log("initializeAuth error", err);
  }
};

//  App 是否登入、 用戶是否正在使用該App 的監聽事件
export const useAppLifecycle = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const personal = useAppSelector(selectUser); // 直接在 Hook 中使用

  useEffect(() => {
    // 應用程式初始化
    dispatch(initializeAuth());

    // 應用程式變化監聽

    const handleAppStateChange = async (state: string) => {
      // 只有已登入的情況下觸發 fetch
      if (state === "active" && isAuthenticated) {
        await fetchAllData({
          dispatch,
          userId: personal.userId,
        });
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [dispatch, isAuthenticated, personal.userId]);
};
