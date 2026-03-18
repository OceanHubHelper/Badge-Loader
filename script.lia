print("Badge Loader Script Running")

-- your real script goes here

--// VxText V2 - Galaxy Stable Final Patch

local Players = game:GetService("Players")
local TextService = game:GetService("TextService")
local TweenService = game:GetService("TweenService")
local UIS = game:GetService("UserInputService")

local player = Players.LocalPlayer

--------------------------------------------------
-- SETTINGS
--------------------------------------------------

local settings = {
	TextSize = 30,
	TextColor = Color3.fromRGB(255,255,255),
	BackgroundColor = Color3.fromRGB(40,0,70)
}

local pixelEnabled = false
local foldingEnabled = false
local multiEnabled = false
local generatedTexts = {}
local activeDropdown = nil
local MAX_WIDTH = 500

--------------------------------------------------
-- GUI
--------------------------------------------------

local gui = Instance.new("ScreenGui")
gui.Name = "VxTextV2"
gui.ResetOnSpawn = false
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
gui.Parent = player:WaitForChild("PlayerGui")

--------------------------------------------------
-- BUTTON STYLE
--------------------------------------------------

local function styleButton(btn)
	btn.BackgroundColor3 = Color3.fromRGB(25,0,50)
	btn.TextColor3 = Color3.fromRGB(230,200,255)
	btn.Font = Enum.Font.GothamBold
	btn.TextScaled = true
	Instance.new("UICorner",btn).CornerRadius = UDim.new(0,16)
	local stroke = Instance.new("UIStroke",btn)
	stroke.Color = Color3.fromRGB(150,0,255)
	stroke.Thickness = 1.5
end

--------------------------------------------------
-- OPEN BUTTON
--------------------------------------------------

local openBtn = Instance.new("TextButton",gui)
openBtn.Size = UDim2.fromScale(0.15,0.06)
openBtn.Position = UDim2.fromScale(0.03,0.05)
openBtn.Text = "Open Menu"
styleButton(openBtn)

local main = Instance.new("Frame",gui)
main.Size = UDim2.fromScale(0.45,0.7)
main.Position = UDim2.fromScale(0.27,0.15)
main.BackgroundColor3 = Color3.fromRGB(12,0,25)
main.Visible = false
main.Active = true
main.Draggable = true
Instance.new("UICorner",main)

openBtn.MouseButton1Click:Connect(function()
	main.Visible = not main.Visible
end)

--------------------------------------------------
-- TABS
--------------------------------------------------

local tabText = Instance.new("TextButton",main)
tabText.Size = UDim2.fromScale(0.5,0.08)
tabText.Text = "Text"
styleButton(tabText)

local tabCustom = Instance.new("TextButton",main)
tabCustom.Size = UDim2.fromScale(0.5,0.08)
tabCustom.Position = UDim2.fromScale(0.5,0)
tabCustom.Text = "Customize"
styleButton(tabCustom)

local textPage = Instance.new("Frame",main)
textPage.Size = UDim2.fromScale(1,0.92)
textPage.Position = UDim2.fromScale(0,0.08)
textPage.BackgroundTransparency = 1

local customPage = Instance.new("Frame",main)
customPage.Size = UDim2.fromScale(1,0.92)
customPage.Position = UDim2.fromScale(0,0.08)
customPage.BackgroundTransparency = 1
customPage.Visible = false

tabText.MouseButton1Click:Connect(function()
	textPage.Visible = true
	customPage.Visible = false
end)

tabCustom.MouseButton1Click:Connect(function()
	textPage.Visible = false
	customPage.Visible = true
end)

--------------------------------------------------
-- TEXT TAB
--------------------------------------------------

local textBox = Instance.new("TextBox",textPage)
textBox.Size = UDim2.fromScale(0.9,0.12)
textBox.Position = UDim2.fromScale(0.05,0.1)
textBox.PlaceholderText = "Enter text..."
textBox.BackgroundColor3 = Color3.fromRGB(30,0,60)
textBox.TextColor3 = Color3.fromRGB(230,200,255)
textBox.Font = Enum.Font.GothamBold
textBox.TextScaled = true
Instance.new("UICorner",textBox)

-- MULTIPLE TOGGLE FIXED

local multiBtn = Instance.new("TextButton",textPage)
multiBtn.Size = UDim2.fromScale(0.9,0.12)
multiBtn.Position = UDim2.fromScale(0.05,0.25)
multiBtn.Text = "Multiple Text: OFF"
styleButton(multiBtn)

multiBtn.MouseButton1Click:Connect(function()
	multiEnabled = not multiEnabled
	multiBtn.Text = multiEnabled and "Multiple Text: ON" or "Multiple Text: OFF"

	-- FIXED LOGIC
	if not multiEnabled and #generatedTexts > 1 then
		for i = #generatedTexts,2,-1 do
			generatedTexts[i].frame:Destroy()
			table.remove(generatedTexts,i)
		end
	end
end)

local generateBtn = Instance.new("TextButton",textPage)
generateBtn.Size = UDim2.fromScale(0.9,0.12)
generateBtn.Position = UDim2.fromScale(0.05,0.4)
generateBtn.Text = "Generate"
styleButton(generateBtn)

local deleteBtn = Instance.new("TextButton",textPage)
deleteBtn.Size = UDim2.fromScale(0.9,0.12)
deleteBtn.Position = UDim2.fromScale(0.05,0.55)
deleteBtn.Text = "Delete All"
styleButton(deleteBtn)

--------------------------------------------------
-- GENERATE FUNCTION
--------------------------------------------------

local function generateText()

	if textBox.Text == "" then return end

	local finalText = textBox.Text
	local fontToUse = pixelEnabled and Enum.Font.Arcade or Enum.Font.GothamBold

	if not multiEnabled and #generatedTexts >= 1 then
		generatedTexts[1].frame:Destroy()
		generatedTexts = {}
	end

	local textSize = TextService:GetTextSize(finalText,settings.TextSize,fontToUse,Vector2.new(1000,1000))

	local holder = Instance.new("Frame",gui)
	holder.Size = UDim2.fromOffset(textSize.X+40,textSize.Y+40)
	holder.Position = UDim2.new(0.5,-(textSize.X+40)/2,0.5,-(textSize.Y+40)/2)
	holder.BackgroundColor3 = settings.BackgroundColor
	holder.Active = true
	holder.Draggable = true
	holder.ZIndex = 100
	Instance.new("UICorner",holder)

	local label = Instance.new("TextLabel",holder)
	label.Size = UDim2.new(1,-20,1,-20)
	label.Position = UDim2.new(0,10,0,10)
	label.BackgroundTransparency = 1
	label.Text = finalText
	label.TextColor3 = settings.TextColor
	label.TextSize = settings.TextSize
	label.Font = fontToUse

	table.insert(generatedTexts,{frame=holder,label=label})
end

generateBtn.MouseButton1Click:Connect(generateText)

deleteBtn.MouseButton1Click:Connect(function()
	for _,v in ipairs(generatedTexts) do
		v.frame:Destroy()
	end
	generatedTexts = {}
end)

--------------------------------------------------
-- CUSTOM TAB
--------------------------------------------------

local pixelBtn = Instance.new("TextButton",customPage)
pixelBtn.Size = UDim2.fromScale(0.9,0.12)
pixelBtn.Position = UDim2.fromScale(0.05,0.1)
pixelBtn.Text = "Pixel Font: OFF"
styleButton(pixelBtn)

pixelBtn.MouseButton1Click:Connect(function()
	pixelEnabled = not pixelEnabled
	pixelBtn.Text = pixelEnabled and "Pixel Font: ON" or "Pixel Font: OFF"
end)

--------------------------------------------------
-- COLOR DROPDOWNS (SCROLLABLE)
--------------------------------------------------

local colors = {
	{"White",Color3.fromRGB(255,255,255)},
	{"Black",Color3.fromRGB(0,0,0)},
	{"Red",Color3.fromRGB(255,0,0)},
	{"Green",Color3.fromRGB(0,255,0)},
	{"Blue",Color3.fromRGB(0,0,255)},
	{"Purple",Color3.fromRGB(150,0,255)},
	{"Pink",Color3.fromRGB(255,105,180)},
	{"Cyan",Color3.fromRGB(0,255,255)},
	{"Gold",Color3.fromRGB(255,215,0)},
	{"Orange",Color3.fromRGB(255,140,0)},
	{"Magenta",Color3.fromRGB(255,0,255)},
	{"Teal",Color3.fromRGB(0,128,128)}
}

local function closeDropdown()
	if activeDropdown then
		activeDropdown:Destroy()
		activeDropdown = nil
	end
end

local function createDropdown(button,settingKey)

	closeDropdown()

	local frame = Instance.new("Frame",gui)
	frame.Size = UDim2.fromOffset(220,200)
	frame.Position = UDim2.fromOffset(button.AbsolutePosition.X,button.AbsolutePosition.Y+button.AbsoluteSize.Y)
	frame.BackgroundColor3 = Color3.fromRGB(20,0,40)
	frame.ZIndex = 200
	Instance.new("UICorner",frame)

	local scroll = Instance.new("ScrollingFrame",frame)
	scroll.Size = UDim2.new(1,0,1,0)
	scroll.CanvasSize = UDim2.new(0,0,0,#colors*35)
	scroll.ScrollBarThickness = 6
	scroll.BackgroundTransparency = 1

	activeDropdown = frame

	for i,data in ipairs(colors) do
		local option = Instance.new("TextButton",scroll)
		option.Size = UDim2.new(1,0,0,30)
		option.Position = UDim2.new(0,0,0,(i-1)*35)
		option.Text = data[1]
		styleButton(option)

		option.MouseButton1Click:Connect(function()
			settings[settingKey] = data[2]
			button.Text = settingKey..": "..data[1]
			closeDropdown()
		end)
	end
end

local textColorBtn = Instance.new("TextButton",customPage)
textColorBtn.Size = UDim2.fromScale(0.9,0.12)
textColorBtn.Position = UDim2.fromScale(0.05,0.25)
textColorBtn.Text = "Text Color: White"
styleButton(textColorBtn)

textColorBtn.MouseButton1Click:Connect(function()
	createDropdown(textColorBtn,"TextColor")
end)

local bgColorBtn = Instance.new("TextButton",customPage)
bgColorBtn.Size = UDim2.fromScale(0.9,0.12)
bgColorBtn.Position = UDim2.fromScale(0.05,0.4)
bgColorBtn.Text = "Background Color: Purple"
styleButton(bgColorBtn)

bgColorBtn.MouseButton1Click:Connect(function()
	createDropdown(bgColorBtn,"BackgroundColor")
end)
