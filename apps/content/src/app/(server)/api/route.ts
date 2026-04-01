import { NextResponse } from "next/server";

/**
 *  ヘルスチェック用エンドポイント。
 *
 *  @api
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}
