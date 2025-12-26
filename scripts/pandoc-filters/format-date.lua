-- Formats the document date into "YYYY Mon DD" and stores it in meta.date_display.
-- Accepts dates like 2025-10-08, 2025/10/08, or "2025 Oct 08".

local month_map = {
  jan = "Jan", feb = "Feb", mar = "Mar", apr = "Apr",
  may = "May", jun = "Jun", jul = "Jul", aug = "Aug",
  sep = "Sep", oct = "Oct", nov = "Nov", dec = "Dec"
}

local function pad2(n)
  n = tonumber(n)
  if not n then return nil end
  return string.format("%02d", n)
end

local function parse_date(str)
  if not str or str == "" then return nil end
  -- 2025-10-08 or 2025/10/08
  local y, m, d = str:match("^(%d%d%d%d)[%-/](%d%d)[%-/](%d%d)$")
  if y and m and d then
    local mon = tonumber(m)
    if mon and mon >= 1 and mon <= 12 then
      return y, month_map[os.date("%b", os.time{year=1970, month=mon, day=1}):lower()] or month_map[("janfebmaraprmayjunjulaugsepoctnovdec"):sub((mon-1)*3+1,(mon-1)*3+3):lower()], pad2(d)
    end
  end

  -- 2025 Oct 08
  local y2, mon_txt, d2 = str:match("^(%d%d%d%d)%s+([A-Za-z]+)%s+(%d%d?)$")
  if y2 and mon_txt and d2 then
    local mon_key = mon_txt:sub(1,3):lower()
    local mon_norm = month_map[mon_key]
    if mon_norm then
      return y2, mon_norm, pad2(d2)
    end
  end

  return nil
end

function Meta(meta)
  local date_val = meta.date
  if not date_val then
    return meta
  end

  local date_str = pandoc.utils.stringify(date_val)
  local y, mon, d = parse_date(date_str)
  if y and mon and d then
    meta["date_display"] = pandoc.MetaString(string.format("%s %s %s", y, mon, d))
  end

  return meta
end
