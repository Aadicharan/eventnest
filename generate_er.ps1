# Generate EventNest ER Diagram using System.Drawing
Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 800
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# Header
$titleFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Regular)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))

$g.DrawString("EVENTNEST - Relational Entity-Relationship (ER) Diagram", $titleFont, $titleBrush, 50, 35)
$g.DrawString("Relational Data Model: Students (1) <----> (M) Registrations (M) <----> (1) Events", $subFont, $subBrush, 52, 80)

# Colors
$headerBgStudents = [System.Drawing.Color]::FromArgb(37, 99, 235)      # Blue
$headerBgRegistrations = [System.Drawing.Color]::FromArgb(16, 185, 129) # Emerald Green
$headerBgEvents = [System.Drawing.Color]::FromArgb(124, 58, 237)       # Purple

$cardBg = [System.Drawing.Color]::White
$borderCol = [System.Drawing.Color]::FromArgb(226, 232, 240)
$textDark = [System.Drawing.Color]::FromArgb(30, 41, 59)
$textMuted = [System.Drawing.Color]::FromArgb(100, 116, 139)
$textMutedBrush = New-Object System.Drawing.SolidBrush($textMuted)
$pkColor = [System.Drawing.Color]::FromArgb(217, 119, 6)
$fkColor = [System.Drawing.Color]::FromArgb(13, 148, 136)

$tableFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$fieldFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
$tagFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)

function Draw-RoundedCard($gfx, $x, $y, $w, $h, $radius, $fillColor, $borderColor) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
    $path.AddArc($x + $w - $diameter, $y, $diameter, $diameter, 270, 90)
    $path.AddArc($x + $w - $diameter, $y + $h - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($x, $y + $h - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    
    $brush = New-Object System.Drawing.SolidBrush($fillColor)
    $gfx.FillPath($brush, $path)
    $pen = New-Object System.Drawing.Pen($borderColor, 1.5)
    $gfx.DrawPath($pen, $path)
}

function Draw-EntityTable($gfx, $x, $y, $w, $tableName, $headerColor, $fields) {
    $h = 50 + ($fields.Count * 36) + 15
    # Card shadow
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 0, 0, 0))
    $gfx.FillRectangle($shadowBrush, $x + 4, $y + 4, $w, $h)
    
    # White base
    $baseBrush = New-Object System.Drawing.SolidBrush($cardBg)
    $gfx.FillRectangle($baseBrush, $x, $y, $w, $h)
    $borderPen = New-Object System.Drawing.Pen($borderCol, 2)
    $gfx.DrawRectangle($borderPen, $x, $y, $w, $h)
    
    # Table Header Bar
    $hBrush = New-Object System.Drawing.SolidBrush($headerColor)
    $gfx.FillRectangle($hBrush, $x, $y, $w, 46)
    $wBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $gfx.DrawString($tableName, $tableFont, $wBrush, $x + 16, $y + 12)
    
    # Field rows
    $rowY = $y + 54
    $tBrush = New-Object System.Drawing.SolidBrush($textDark)
    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(241, 245, 249), 1)
    
    foreach ($field in $fields) {
        $fieldName = $field.Name
        $fieldType = $field.Type
        $keyTag = $field.Key
        
        # Tag background if PK or FK
        if ($keyTag -eq "PK") {
            $tagBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 243, 199))
            $tagText = New-Object System.Drawing.SolidBrush($pkColor)
            $gfx.FillRectangle($tagBg, $x + 14, $rowY + 4, 30, 20)
            $gfx.DrawString("PK", $tagFont, $tagText, $x + 20, $rowY + 6)
        } elseif ($keyTag -eq "FK") {
            $tagBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(204, 251, 241))
            $tagText = New-Object System.Drawing.SolidBrush($fkColor)
            $gfx.FillRectangle($tagBg, $x + 14, $rowY + 4, 30, 20)
            $gfx.DrawString("FK", $tagFont, $tagText, $x + 20, $rowY + 6)
        } else {
            $bulletBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))
            $gfx.FillEllipse($bulletBrush, $x + 24, $rowY + 11, 6, 6)
        }
        
        $gfx.DrawString($fieldName, $fieldFont, $tBrush, $x + 52, $rowY + 5)
        
        $typeBrush = New-Object System.Drawing.SolidBrush($textMuted)
        $gfx.DrawString($fieldType, $fieldFont, $typeBrush, $x + $w - 120, $rowY + 5)
        
        $gfx.DrawLine($linePen, $x + 10, $rowY + 34, $x + $w - 10, $rowY + 34)
        $rowY += 36
    }
}

# Define Entities
$studentFields = @(
    @{ Name = "id"; Type = "SERIAL"; Key = "PK" },
    @{ Name = "name"; Type = "VARCHAR(100)"; Key = "" },
    @{ Name = "email"; Type = "VARCHAR(120) [UQ]"; Key = "" },
    @{ Name = "student_id"; Type = "VARCHAR(50) [UQ]"; Key = "" }
)

$regFields = @(
    @{ Name = "id"; Type = "SERIAL"; Key = "PK" },
    @{ Name = "student_id"; Type = "INT (REFERENCES)"; Key = "FK" },
    @{ Name = "event_id"; Type = "INT (REFERENCES)"; Key = "FK" },
    @{ Name = "registered_at"; Type = "TIMESTAMP"; Key = "" }
)

$eventFields = @(
    @{ Name = "id"; Type = "SERIAL"; Key = "PK" },
    @{ Name = "title"; Type = "VARCHAR(200)"; Key = "" },
    @{ Name = "description"; Type = "TEXT"; Key = "" },
    @{ Name = "date"; Type = "DATE"; Key = "" },
    @{ Name = "time"; Type = "VARCHAR(50)"; Key = "" },
    @{ Name = "venue"; Type = "VARCHAR(150)"; Key = "" },
    @{ Name = "max_participants"; Type = "INT CHECK > 0"; Key = "" }
)

# Draw Tables (STUDENTS on left, REGISTRATIONS in center, EVENTS on right)
Draw-EntityTable $g 50 170 300 "STUDENTS" $headerBgStudents $studentFields
Draw-EntityTable $g 450 170 300 "REGISTRATIONS" $headerBgRegistrations $regFields
Draw-EntityTable $g 850 170 300 "EVENTS" $headerBgEvents $eventFields

# Connectors and Relationships
$relPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(71, 85, 105), 3)
$relPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Solid

# Line from STUDENTS to REGISTRATIONS
$g.DrawLine($relPen, 350, 240, 450, 240)

# Line from REGISTRATIONS to EVENTS
$g.DrawLine($relPen, 750, 280, 850, 280)

# Cardinality Badges & Labels
$badgeFont = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
$labelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))

# 1 : M (Left side)
$g.FillRectangle($badgeBg, 362, 215, 24, 22)
$g.DrawRectangle($badgePen, 362, 215, 24, 22)
$g.DrawString("1", $badgeFont, $labelBrush, 370, 217)

$g.FillRectangle($badgeBg, 412, 215, 26, 22)
$g.DrawRectangle($badgePen, 412, 215, 26, 22)
$g.DrawString("M", $badgeFont, $labelBrush, 418, 217)

$relDescFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Italic)
$g.DrawString("1 Student registers for", $relDescFont, $subBrush, 348, 246)
$g.DrawString("Many Events", $relDescFont, $subBrush, 368, 262)

# M : 1 (Right side)
$g.FillRectangle($badgeBg, 762, 255, 26, 22)
$g.DrawRectangle($badgePen, 762, 255, 26, 22)
$g.DrawString("M", $badgeFont, $labelBrush, 768, 257)

$g.FillRectangle($badgeBg, 812, 255, 24, 22)
$g.DrawRectangle($badgePen, 812, 255, 24, 22)
$g.DrawString("1", $badgeFont, $labelBrush, 820, 257)

$g.DrawString("Many Students register", $relDescFont, $subBrush, 750, 286)
$g.DrawString("for 1 Event", $relDescFont, $subBrush, 770, 302)

# Constraints & Academic Concepts Footer Box
$footerY = 560
$footerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillRectangle($footerBrush, 50, $footerY, 1100, 190)
$footerBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 2)
$g.DrawRectangle($footerBorder, 50, $footerY, 1100, 190)

$legendHeadFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$legendBodyFont = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$legendBold = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)

$g.DrawString("DATABASE DESIGN & INTEGRITY CONSTRAINTS", $legendHeadFont, $titleBrush, 70, $footerY + 15)

$g.DrawString("1. Primary Keys (PK):", $legendBold, $titleBrush, 70, $footerY + 45)
$g.DrawString("students.id, events.id, registrations.id ensure entity uniqueness across all tables.", $legendBodyFont, $textMutedBrush, 230, $footerY + 45)

$g.DrawString("2. Foreign Keys (FK):", $legendBold, $titleBrush, 70, $footerY + 70)
$g.DrawString("registrations.student_id -> students(id) [ON DELETE CASCADE]", $legendBodyFont, $textMutedBrush, 230, $footerY + 70)
$g.DrawString("registrations.event_id -> events(id) [ON DELETE CASCADE] enforcing referential integrity.", $legendBodyFont, $textMutedBrush, 230, $footerY + 90)

$g.DrawString("3. Unique Constraint:", $legendBold, $titleBrush, 70, $footerY + 115)
$g.DrawString("UNIQUE(student_id, event_id) prevents duplicate registrations for the same event.", $legendBodyFont, $textMutedBrush, 230, $footerY + 115)

$g.DrawString("4. Check Constraint:", $legendBold, $titleBrush, 70, $footerY + 140)
$g.DrawString("CHECK(max_participants > 0) guarantees valid event seating capacity.", $legendBodyFont, $textMutedBrush, 230, $footerY + 140)

# Save to docs/er-diagram.png
$targetDir = "c:\Users\C N Aadicharan\Pictures\Event nest\docs"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
$targetPath = Join-Path $targetDir "er-diagram.png"
$bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output "Successfully saved ER diagram to $targetPath"
