export function SendTwoh(res: any, data: any) {
  res.status(200).json({ message: "created", data });
}
export function SendServerError(res: any) {
  res.status(500).json({ message: "Internal server errro" });
}
