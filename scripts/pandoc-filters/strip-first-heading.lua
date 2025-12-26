-- Removes the first level-1 heading from the document body.
local seen = false

function Header(el)
  if not seen and el.level == 1 then
    seen = true
    return {}
  end
end
